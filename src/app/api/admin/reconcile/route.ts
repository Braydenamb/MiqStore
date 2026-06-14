import { NextRequest } from "next/server";
import { apiSuccess, API_ERRORS } from "@/lib/api-response";
import { getOrderStatus } from "@/lib/services/apigames";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/telemetry";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/reconcile
 * 
 * Reconciliation Engine:
 * Scans for transactions stuck in 'PROCESSING' or 'PENDING' state
 * for more than 10 minutes, checks their status against the provider API,
 * and updates the DB accordingly.
 */
export async function GET(_req: NextRequest) {
  try {
    // 1. Authorization check
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;
    if (!session?.user || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
      return API_ERRORS.unauthorized();
    }

    // 2. Fetch stuck transactions (PROCESSING or PENDING older than 10 minutes)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const stuckTxs = await prisma.transaction.findMany({
      where: {
        status: { in: ["PROCESSING", "PENDING"] },
        updatedAt: { lt: tenMinutesAgo },
      },
      orderBy: { updatedAt: "asc" },
      take: 50, // Process in batches of 50
    });

    let reconciledCount = 0;
    let failedCount = 0;
    const details: Array<{
      id: string;
      invoiceId: string;
      oldStatus: string;
      newStatus?: string;
      note?: string;
      error?: string;
    }> = [];

    // 3. Process transactions concurrently
    const reconcilePromises = stuckTxs.map(async (tx) => {
      try {
        const providerData = (tx.providerData ?? {}) as Record<string, string>;
        const providerRef = tx.providerRef || providerData.productCode;

        if (!providerRef) {
          throw new Error("No provider reference found");
        }

        if (tx.status === "PENDING") {
          // 1. Sweep missing iPaymu webhooks
          const { getIpaymuTransactionStatus, mapTransactionStatus } = await import("@/lib/services/ipaymu");
          let ipaymuStatus;
          try {
            ipaymuStatus = await getIpaymuTransactionStatus(tx.invoiceId);
          } catch (err) {
            logger.warn(`iPaymu status not found for ${tx.invoiceId}`);
            return { id: tx.id, invoiceId: tx.invoiceId, oldStatus: tx.status, success: false };
          }
          
          const internalIpaymuStatus = mapTransactionStatus(ipaymuStatus?.Data?.Status || "0");
          
          if (internalIpaymuStatus === "PAID") {
             // Simulate webhook flow
             await prisma.transaction.update({
               where: { id: tx.id },
               data: { status: "PROCESSING", updatedAt: new Date() }
             });
             
             // Trigger topup
             const { processTopup } = await import("@/lib/services/transaction");
             const providerData = (tx.providerData ?? {}) as Record<string, string>;
             const txRecord = {
               ...tx,
               gameSlug: providerData.gameSlug || "",
               gameName: providerData.gameName || "",
               productCode: providerData.productCode || tx.productItemId,
               productName: providerData.productName || "",
               paymentStatus: "PAID",
               providerStatus: "processing",
             } as any;
             
             const topupResult = await processTopup(txRecord);
             const finalStatus = topupResult.status === "processing" || topupResult.status === "pending" || topupResult.message.includes("Timeout") 
               ? "PROCESSING" 
               : "SUCCESS";
               
             await prisma.transaction.update({
               where: { id: tx.id },
               data: {
                 status: finalStatus,
                 providerRef: topupResult.providerTrxId,
                 providerData: { ...providerData, serialNumber: topupResult.serialNumber, message: topupResult.message },
                 updatedAt: new Date()
               }
             });
             
             return { id: tx.id, invoiceId: tx.invoiceId, oldStatus: tx.status, newStatus: finalStatus, note: "Reconciled from iPaymu & Processed", success: true };
          } else if (internalIpaymuStatus === "EXPIRED" || internalIpaymuStatus === "FAILED" || internalIpaymuStatus === "REFUNDED") {
             // Mark as expired/failed
             await prisma.transaction.updateMany({
               where: { id: tx.id, status: tx.status },
               data: { status: internalIpaymuStatus, updatedAt: new Date() }
             });
             return { id: tx.id, invoiceId: tx.invoiceId, oldStatus: tx.status, newStatus: internalIpaymuStatus, note: "Reconciled from iPaymu", success: true };
          }
          
          return { id: tx.id, invoiceId: tx.invoiceId, oldStatus: tx.status, success: true };
        }

        // 2. Sweep missing Apigames webhooks for PROCESSING transactions
        const providerStatus = await getOrderStatus(providerRef);

        // Map provider status to internal status
        const statusMap: Record<string, string> = {
          pending: "PENDING",
          processing: "PROCESSING",
          success: "SUCCESS",
          failed: "FAILED",
        };
        const newStatus = statusMap[providerStatus.status] || tx.status;

        if (newStatus !== tx.status) {
          let finalStatus = newStatus;
          let providerDataUpdate = {
            ...providerData,
            serialNumber: providerStatus.sn || "",
            reconcileNote: providerStatus.message,
          };

          if (newStatus === "FAILED" && tx.status !== "FAILED") {
            // OCC Lock
            const claimLock = await prisma.transaction.updateMany({
               where: { id: tx.id, status: tx.status },
               data: { status: "FAILED" }
            });
            if (claimLock.count === 0) return { id: tx.id, invoiceId: tx.invoiceId, oldStatus: tx.status, success: false, note: "Race condition prevented" };

            try {
              const { refundTransaction } = await import("@/lib/services/ipaymu");
              await refundTransaction(tx.invoiceId, `Reconciliation Failed: ${providerStatus.message}`);
              finalStatus = "REFUNDED";
              providerDataUpdate = { ...providerDataUpdate, needsRefund: false, refundStatus: "refunded_automatically" } as any;
              logger.info(`Automated reconcile refund successful for ${tx.invoiceId}`);
            } catch (err) {
              logger.error(`Automated reconcile refund failed for ${tx.invoiceId}`, { error: err instanceof Error ? err.message : err });
              providerDataUpdate = { ...providerDataUpdate, needsRefund: true, refundStatus: "pending_manual_refund" } as any;
            }
          }

          await prisma.transaction.updateMany({
            where: { id: tx.id, status: tx.status },
            data: {
              status: finalStatus as "PENDING" | "PAID" | "PROCESSING" | "SUCCESS" | "FAILED" | "REFUNDED" | "EXPIRED",
              providerRef: providerStatus.trxId || tx.providerRef,
              providerData: providerDataUpdate,
              updatedAt: new Date(),
            },
          });

          return {
            id: tx.id,
            invoiceId: tx.invoiceId,
            oldStatus: tx.status,
            newStatus,
            note: "Reconciled from provider",
            success: true
          };
        }

        return {
          id: tx.id,
          invoiceId: tx.invoiceId,
          oldStatus: tx.status,
          success: true
        };
      } catch (error) {
        logger.error(`Reconciliation failed for ${tx.invoiceId}`, { error: error instanceof Error ? error.message : "Unknown error" });
        return {
          id: tx.id,
          invoiceId: tx.invoiceId,
          oldStatus: tx.status,
          error: error instanceof Error ? error.message : "Unknown error",
          success: false
        };
      }
    });

    const results = await Promise.allSettled(reconcilePromises);

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        const data = result.value;
        details.push({
          id: data.id,
          invoiceId: data.invoiceId,
          oldStatus: data.oldStatus,
          newStatus: data.newStatus,
          note: data.note,
          error: data.error,
        });
        if (data.success && data.newStatus) {
          reconciledCount++;
        } else if (!data.success) {
          failedCount++;
        }
      } else {
        failedCount++;
      }
    });

    // 4. Scan for manual refund queue (paid + topup failed + auto-refund failed)
    // These are the highest-severity operational items: customer paid, got nothing, not refunded.
    const manualRefundQueue = await prisma.transaction.findMany({
      where: {
        status: "FAILED",
        providerData: { path: ["needsRefund"], equals: true },
      },
      select: {
        id: true,
        invoiceId: true,
        total: true,
        createdAt: true,
        userId: true,
        providerData: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // 5. Return results
    return apiSuccess({
      totalScanned: stuckTxs.length,
      reconciled: reconciledCount,
      failed: failedCount,
      details,
      manualRefundQueue: manualRefundQueue.map((tx) => ({
        invoiceId: tx.invoiceId,
        amount: tx.total,
        createdAt: tx.createdAt.toISOString(),
        userId: tx.userId,
        reason: (tx.providerData as Record<string, unknown>)?.error ?? "Unknown",
      })),
      manualRefundCount: manualRefundQueue.length,
    }, { message: "Reconciliation complete" });
  } catch (error) {
    logger.error("[Reconcile] Error:", error);
    return API_ERRORS.internal("Reconciliation failed");
  }
}
