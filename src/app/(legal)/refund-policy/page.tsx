import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Refund Policy | MiqStore",
  description: "Refund and cancellation policy for MiqStore transactions.",
}

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Refund Policy</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>Last updated: June 2026</p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Non-Refundable Transactions</h2>
            <p>Due to the irreversible nature of digital goods, <strong>all successful top-ups are final and non-refundable</strong>. Once a digital product has been delivered to the target account ID, the transaction cannot be reversed under any circumstances. This applies even if you accidentally entered the wrong Game ID or Zone ID.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Refundable Transactions</h2>
            <p>You are eligible for a full refund only if:</p>
            <ul>
              <li>You have successfully paid for the order, but our system failed to deliver the top-up due to a provider outage or system error.</li>
              <li>The specific product you ordered became out of stock or unavailable after your payment was accepted.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Refund Processing Procedure</h2>
            <p>In most cases, if our system detects a fulfillment failure after payment, an automated refund will be initiated immediately. If your transaction status shows as "FAILED" but you have not received your funds, please contact our support team with your Invoice ID (e.g., INV-123456) and proof of payment.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Refund Timeline</h2>
            <p>Once a refund is approved and processed on our end, the time it takes for funds to reflect in your account depends on your payment method:</p>
            <ul>
              <li><strong>E-Wallets (OVO, GoPay, DANA):</strong> 1 to 3 business days.</li>
              <li><strong>Bank Transfers / Virtual Accounts:</strong> 3 to 5 business days.</li>
              <li><strong>Retail Outlets:</strong> Handled via a manual bank transfer request.</li>
            </ul>
            <p>Please note that banking holidays and weekends may delay processing times.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
