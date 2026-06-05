import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BottomNavbar } from "@/components/layout/bottom-navbar";
import { PwaRegistry } from "@/components/pwa-registry";
import { Toaster } from "sonner";
import { APP_NAME, APP_DESCRIPTION, APP_URL } from "@/lib/constants";
import { getSetting } from "@/lib/settings";
import { cloudinaryUrl } from "@/lib/cloudinary";
import "./globals.css";

import { Outfit, Space_Grotesk } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} — Top Up Game & Voucher Digital Termurah`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "top up game",
    "voucher digital",
    "diamond mobile legends",
    "UC PUBG",
    "top up murah",
    "pulsa murah",
    "paket data",
    "e-wallet",
    "PPOB",
    APP_NAME,
  ],
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: APP_URL,
    title: `${APP_NAME} — Top Up Game & Voucher Digital Termurah`,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${APP_NAME} — TopUp Digital Store`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — Top Up Game & Voucher Digital Termurah`,
    description: APP_DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteLogo = await getSetting("site_logo");
  const logoUrl = siteLogo ? (siteLogo.startsWith("http") ? siteLogo : cloudinaryUrl(siteLogo)) : undefined;

  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`min-h-screen bg-[hsl(var(--background))] font-sans antialiased ${outfit.variable} ${spaceGrotesk.variable}`}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Navbar logoUrl={logoUrl} />
            <main className="flex-1 pb-mobile-nav">{children}</main>
            <Footer logoUrl={logoUrl} />
            <BottomNavbar />
          </div>
          <Toaster
            position="top-right"
            theme="system"
            richColors
            closeButton
            toastOptions={{
              className: "glass",
            }}
          />
          <PwaRegistry />
        </Providers>

        {/* Midtrans Snap Script */}
        <Script
          src={
            process.env.MIDTRANS_PRODUCTION === "true"
              ? "https://app.midtrans.com/snap/snap.js"
              : "https://app.sandbox.midtrans.com/snap/snap.js"
          }
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
