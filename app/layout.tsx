import type { Metadata, Viewport } from "next";
import { Outfit, Cinzel, Press_Start_2P } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#020617",
};

export const metadata: Metadata = {
  title: "TimeStories",
  description: "Interactive Time Travel Adventures",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

import { BillingProvider } from '@/components/BillingProvider';
import { AdsProvider } from '@/components/AdsProvider';
import { AnalyticsProvider } from '@/components/AnalyticsProvider';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${outfit.variable} ${cinzel.variable} antialiased`}>
        <ErrorBoundary>
          <AnalyticsProvider>
            <BillingProvider>
              <AdsProvider>
                {children}
              </AdsProvider>
            </BillingProvider>
          </AnalyticsProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
