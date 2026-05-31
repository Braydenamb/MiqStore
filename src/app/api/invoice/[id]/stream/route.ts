import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/invoice/[id]/stream
 * 
 * Server-Sent Events (SSE) endpoint for real-time invoice status updates.
 * The client connects to this endpoint and receives push updates when the 
 * transaction status changes, avoiding the need for constant polling.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Set up SSE headers
  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
  });

  const stream = new ReadableStream({
    async start(controller) {
      // Helper to send events
      const sendEvent = (data: any) => {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
      };

      // 1. Send initial connection success
      sendEvent({ type: "connected", invoiceId: id });

      // In production, you would:
      // A. Fetch initial status from DB and send it
      // B. Subscribe to Redis PubSub or PostgreSQL LISTEN for updates on this invoice
      // C. When an update event is received, send it via sendEvent()
      
      // Since this is a demo, we will simulate receiving an update from a webhook
      // after a few seconds.
      let mockState = 0;
      
      const interval = setInterval(() => {
        mockState++;
        
        if (mockState === 1) {
          sendEvent({ type: "update", status: "paid" });
        } else if (mockState === 2) {
          sendEvent({ type: "update", status: "processing" });
        } else if (mockState === 3) {
          sendEvent({ type: "update", status: "success" });
          clearInterval(interval);
          controller.close();
        }
      }, 4000);

      // Handle client disconnect
      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        // In production: unsubscribe from Redis/DB
      });
    },
  });

  return new Response(stream, { headers });
}
