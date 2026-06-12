import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PwaRegistry } from "@/components/pwa-registry";
import { Toaster } from "sonner";
import { APP_NAME, APP_DESCRIPTION, APP_URL } from "@/lib/constants";
import { getCachedSettings } from "@/lib/settings";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { SettingsProvider } from "@/components/providers/settings-provider";
import "./globals.css";

import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
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
  const settings = await getCachedSettings();
  const siteLogo = settings["site_logo"];
  const logoUrl = siteLogo ? (siteLogo.startsWith("http") ? siteLogo : cloudinaryUrl(siteLogo)) : undefined;

  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`min-h-screen bg-[hsl(var(--background))] font-sans antialiased ${inter.variable} ${playfair.variable}`}>
        <SettingsProvider settings={settings}>
          <Providers>
          <div className="relative flex min-h-screen flex-col">
            {/* Skip to main content — keyboard/screen-reader accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-xl focus:bg-[hsl(var(--primary))] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[hsl(var(--primary-foreground))] focus:shadow-lg"
            >
              Skip to content
            </a>
            <Navbar logoUrl={logoUrl} />
            <main id="main-content" className="flex-1" tabIndex={-1}>{children}</main>
            <Footer logoUrl={logoUrl} />
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
        </SettingsProvider>

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
