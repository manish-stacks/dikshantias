import type { Metadata } from "next";
import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import ClientLayoutWrapper from "@/component/ClientLayoutWrapper";
import Providers from "./providers";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import GlobalBanner from "@/component/GlobalBanner";
export const metadata: Metadata = {
  title: "Best IAS Coaching Centre in Delhi | Dikshant IAS",
  description:
    "Dikshant IAS is a Best IAS coaching centre in Delhi led by Dr S. S. Pandey offering expert guidance, live classes, and personalized mentorship. Enroll today and start your IAS preparation!",
  metadataBase: new URL("https://www.dikshantias.com"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <meta
          name="google-site-verification"
          content="c7FgyR8QTNRAU7VO6riBBz8M8JYhKXKQa11Q8Bn5CN4"
        />

        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-ZB3WCMNJ4D"
        />

        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZB3WCMNJ4D');
          `}
        </Script>
      </head>

      <body>
        <Providers>
          <Suspense fallback={<div>Loading...</div>}>
            <ClientLayoutWrapper>
              <GlobalBanner />
              {children}
            </ClientLayoutWrapper>
          </Suspense>

          {/* ✅ Toast Notifications */}
          <Toaster position="top-center" reverseOrder={false} />
        </Providers>
      </body>
    </html>
  );
}
