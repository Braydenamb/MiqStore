import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | MiqStore",
  description: "How we handle and protect your data at MiqStore.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>Last updated: May 2026</p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, including your email address, gaming IDs, and transaction history to facilitate top-up services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to process transactions securely via Midtrans, communicate with you about your orders, and prevent fraud using automated systems.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Data Sharing</h2>
            <p>We do not sell your personal data. We share data only with essential third-party services (such as payment gateways and product providers) strictly to fulfill your orders.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Security</h2>
            <p>Your connection to MiqStore is secured using SSL, and all payment processing is handled off-site by Midtrans. We do not store your credit card information.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
