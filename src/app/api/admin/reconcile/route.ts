import { NextRequest } from "next/server";
import { apiSuccess, API_ERRORS } from "@/lib/api-response";
import { getOrderStatus } from "@/lib/services/apigames";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    // 3. Process each transaction
    for (const tx of stuckTxs) {
      try {
        const providerData = (tx.providerData ?? {}) as Record<string, string>;
        const providerRef = tx.providerRef || providerData.productCode;

        if (!providerRef) {
          details.push({
            id: tx.id,
            invoiceId: tx.invoiceId,
            oldStatus: tx.status,
            error: "No provider reference found",
          });
          failedCount++;
          continue;
        }

        // Check status with Apigames
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
          await prisma.transaction.update({
            where: { id: tx.id },
            data: {
              status: newStatus as "PENDING" | "PAID" | "PROCESSING" | "SUCCESS" | "FAILED" | "REFUNDED" | "EXPIRED",
              providerRef: providerStatus.trxId || tx.providerRef,
              providerData: {
                ...providerData,
                serialNumber: providerStatus.sn || "",
                reconcileNote: providerStatus.message,
              },
              updatedAt: new Date(),
            },
          });

          reconciledCount++;
          details.push({
            id: tx.id,
            invoiceId: tx.invoiceId,
            oldStatus: tx.status,
            newStatus,
            note: "Reconciled from provider",
          });
        }
      } catch (error) {
        console.error(`Reconciliation failed for ${tx.invoiceId}`, error);
        failedCount++;
        details.push({
          id: tx.id,
          invoiceId: tx.invoiceId,
          oldStatus: tx.status,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // 4. Return results
    return apiSuccess({
      totalScanned: stuckTxs.length,
      reconciled: reconciledCount,
      failed: failedCount,
      details,
    }, { message: "Reconciliation complete" });
  } catch (error) {
    console.error("[Reconcile] Error:", error);
    return API_ERRORS.internal("Reconciliation failed");
  }
}
