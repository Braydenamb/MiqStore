import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | MiqStore",
  description: "Terms and conditions for using MiqStore digital top-up services.",
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>Last updated: June 2026</p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Service Description</h2>
            <p>MiqStore is a digital storefront providing virtual goods, game top-ups, and digital vouchers. We act as a platform facilitating the transaction between the user and official digital product providers. All digital goods are delivered electronically.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Payment Terms</h2>
            <p>All prices listed on our platform are final at the time of checkout. We accept payments through official channels and gateways including bank transfers, e-wallets, and retail outlets. Transactions will only be processed after full payment has been successfully verified.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Account Responsibility</h2>
            <p>The user is strictly responsible for providing the correct Game User ID, Zone ID, or account identifiers. MiqStore cannot verify the ownership of an account ID. If a transaction is successfully fulfilled to an incorrect ID provided by the user, the transaction is considered complete and no compensation or reversal will be provided.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Limitation of Liability</h2>
            <p>MiqStore is not liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services. This includes, but is not limited to, server outages at the game publisher, temporary suspensions of the user's game account, or delays in top-up processing due to third-party provider maintenance. Our maximum liability in any case is strictly limited to the amount paid by the user for the specific transaction in question.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
