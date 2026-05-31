import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | MiqStore",
  description: "Terms and conditions for using MiqStore.",
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>Last updated: May 2026</p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using MiqStore, you accept and agree to be bound by the terms and provisions of this agreement.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Service Description</h2>
            <p>MiqStore provides digital game top-up and voucher services. We act as an intermediary between users and digital product providers.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Payments and Refunds</h2>
            <p>All transactions are final upon successful delivery of the digital product. Refunds are only issued in the event of a system failure where the product cannot be delivered by our providers.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. User Responsibilities</h2>
            <p>Users are responsible for providing correct Game IDs and Zone IDs. MiqStore is not liable for items sent to an incorrect ID provided by the user.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
