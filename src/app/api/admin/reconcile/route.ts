import { NextRequest, NextResponse } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { getOrderStatus } from "@/lib/services/apigames";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/reconcile
 * 
 * Reconciliation Engine:
 * Scans for transactions that have been stuck in 'processing' or 'pending' state
 * for an extended period, and manually checks their status against the provider API
 * (Apigames / Midtrans) to ensure our database is in sync, handling cases where 
 * webhooks might have been missed or failed.
 */
export async function GET(req: NextRequest) {
  // 1. Authorization check
  // In production: verify admin JWT token
  
  // 2. Fetch pending/processing transactions from DB
  // In production: const stuckTxs = await prisma.transaction.findMany({ where: { status: { in: ['pending', 'processing'] } } });
  const mockStuckTxs = [
    { id: "INV-20231101-001", providerOrderId: "API-9921", status: "processing" },
    { id: "INV-20231101-002", providerOrderId: "API-9922", status: "processing" },
  ];

  let reconciledCount = 0;
  let failedCount = 0;
  const details = [];

  // 3. Process each transaction
  for (const tx of mockStuckTxs) {
    try {
      // Check status with Apigames
      const providerStatus = await getOrderStatus(tx.providerOrderId);
      
      // If status differs, update our DB
      if (providerStatus.status !== tx.status) {
        // In production: await prisma.transaction.update(...)
        reconciledCount++;
        details.push({
          id: tx.id,
          oldStatus: tx.status,
          newStatus: providerStatus.status,
          note: "Reconciled from provider"
        });
      }
    } catch (error) {
      console.error(`Reconciliation failed for ${tx.id}`, error);
      failedCount++;
      details.push({
        id: tx.id,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // 4. Return results
  return apiSuccess({
    totalScanned: mockStuckTxs.length,
    reconciled: reconciledCount,
    failed: failedCount,
    details
  }, { message: "Reconciliation complete" });
}
