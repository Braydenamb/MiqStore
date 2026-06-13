import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/invoice/[id]/stream
 * 
 * Server-Sent Events (SSE) endpoint for real-time invoice status updates.
 * Polls the database every 3 seconds for status changes and pushes updates
 * to the client. Connection closes on terminal status or client disconnect.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const sendEvent = (data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // 1. Send initial connection success
      sendEvent({ type: "connected", invoiceId: id });

      // 2. Send initial status from DB
      try {
        const initialTx = await prisma.transaction.findUnique({
          where: { invoiceId: id },
          select: { status: true },
        });

        if (initialTx) {
          sendEvent({ type: "update", status: initialTx.status.toLowerCase() });

          // If already terminal, close immediately
          if (["SUCCESS", "FAILED", "EXPIRED", "REFUNDED"].includes(initialTx.status)) {
            controller.close();
            return;
          }
        }
      } catch {
        sendEvent({ type: "error", message: "Failed to fetch initial status" });
      }

      // 3. Poll DB for status changes
      let lastStatus = "";
      const interval = setInterval(async () => {
        try {
          const tx = await prisma.transaction.findUnique({
            where: { invoiceId: id },
            select: { status: true, providerRef: true },
          });

          if (!tx) {
            sendEvent({ type: "error", message: "Invoice not found" });
            clearInterval(interval);
            controller.close();
            return;
          }

          const currentStatus = tx.status.toLowerCase();

          if (currentStatus !== lastStatus) {
            lastStatus = currentStatus;
            sendEvent({
              type: "update",
              status: currentStatus,
              providerRef: tx.providerRef || undefined,
            });
          }

          // Close on terminal status
          if (["success", "failed", "expired", "refunded"].includes(currentStatus)) {
            clearInterval(interval);
            controller.close();
          }
        } catch {
          // Silently retry on next interval
        }
      }, 3000);

      // Handle client disconnect
      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
      });
    },
  });

  return new Response(stream, { headers });
}
