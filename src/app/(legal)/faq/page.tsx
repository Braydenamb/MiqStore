import { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQ | MiqStore",
  description: "Frequently Asked Questions for MiqStore top-up services.",
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Frequently Asked Questions</h1>
        
        <div className="space-y-6 mt-8">
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-2">How do I buy a top-up?</h3>
            <p className="text-muted-foreground">1. Select your game from the homepage.<br/>2. Enter your Game User ID (and Zone ID if applicable).<br/>3. Choose the item or amount you wish to purchase.<br/>4. Select your preferred payment method and click "Beli Sekarang".<br/>5. Complete the payment, and the top-up will be sent automatically.</p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-2">How long do top-ups take to process?</h3>
            <p className="text-muted-foreground">Most top-ups are processed instantly and usually arrive within 1 to 5 minutes after your payment is successfully verified. During peak events or server maintenance from the game publisher, delays of up to 30 minutes may occur.</p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-2">What happens if my payment succeeds but the top-up fails?</h3>
            <p className="text-muted-foreground">If our system detects that your payment was successful but the top-up could not be delivered, we will automatically mark the transaction as FAILED and initiate a refund. You can track your order status on your invoice page. Refer to our Refund Policy for processing timelines.</p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-2">I entered the wrong Game ID. Can I get a refund?</h3>
            <p className="text-muted-foreground">Unfortunately, no. Once a top-up is processed successfully to the ID provided during checkout, the transaction is irreversible. Please always double-check your Game ID before completing payment.</p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-2">How can I contact Support?</h3>
            <p className="text-muted-foreground">If you have issues with an order that has been stuck in "Processing" for more than 1 hour, please contact our support team at <strong>support@miqstore.online</strong> or reach out via our WhatsApp business number listed in the footer. Please include your Invoice ID in your message.</p>
          </div>

        </div>
      </div>
    </div>
  )
}
