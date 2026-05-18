import "@/app/lib/i18n";

import type {
  Metadata,
} from "next";

import {
  GeistSans,
  GeistMono,
} from "geist/font";

import "./globals.css";

import Script from "next/script";

import dynamic from "next/dynamic";

// =========================
// Dynamic Components
// =========================

const Providers = dynamic(
  () => import("./providers"),
  {
    ssr: false,
  }
);

const ClientLayoutWrapper =
  dynamic(
    () =>
      import(
        "@/component/ClientLayoutWrapper"
      ),
    {
      ssr: false,
    }
  );

const ToasterComponent =
  dynamic(
    async () => {

      const mod =
        await import(
          "react-hot-toast"
        );

      return mod.Toaster;

    },
    {
      ssr: false,
    }
  );

const AuthInitializer =
  dynamic(
    () =>
      import(
        "@/lib/AuthProvider"
      ),
    {
      ssr: false,
    }
  );


  
// =========================
// SEO
// =========================

export const metadata:
Metadata = {

  title:
    "Best IAS Coaching Centre in Delhi | Dikshant IAS",

  description:
    "Dikshant IAS is a Best IAS coaching centre in Delhi led by Dr S. S. Pandey offering expert guidance, live classes, and personalized mentorship. Enroll today and start your IAS preparation!",

  metadataBase: new URL(
    "https://www.dikshantias.com"
  ),

  alternates: {
    canonical: "/",
  },

};

// =========================
// Layout
// =========================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <html
      lang="en"
      className={`
        ${GeistSans.variable}
        ${GeistMono.variable}
      `}
    >

      <head>

        {/* Verification */}

        <meta
          name="google-site-verification"
          content="c7FgyR8QTNRAU7VO6riBBz8M8JYhKXKQa11Q8Bn5CN4"
        />

        {/* =========================
            GTM
        ========================= */}

        <Script
          id="gtm-script"
          strategy="lazyOnload"
        >

          {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({
                'gtm.start':
                new Date().getTime(),
                event:'gtm.js'
              });

              var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),
              dl=l!='dataLayer'
              ?'&l='+l:'';

              j.async=true;

              j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;

              f.parentNode.insertBefore(j,f);

            })(
              window,
              document,
              'script',
              'dataLayer',
              'GTM-TPMDKLV'
            );
          `}

        </Script>

        {/* =========================
            Google Analytics
        ========================= */}

        <Script
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-ZB3WCMNJ4D"
        />

        <Script
          id="google-analytics"
          strategy="lazyOnload"
        >

          {`
            window.dataLayer =
              window.dataLayer || [];

            function gtag(){
              dataLayer.push(arguments);
            }

            gtag('js', new Date());

            gtag(
              'config',
              'G-ZB3WCMNJ4D'
            );
          `}

        </Script>

      </head>

      <body>

        {/* GTM NOSCRIPT */}

        <noscript>

          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TPMDKLV"
            height="0"
            width="0"
            style={{
              display: "none",
              visibility:
                "hidden",
            }}
          />

        </noscript>

        {/* =========================
            Providers
        ========================= */}

        <Providers>

          {/* Auth */}

          <AuthInitializer />

          {/* Layout */}

          <ClientLayoutWrapper>

            {children}

          </ClientLayoutWrapper>

          {/* Toast */}

          <ToasterComponent
            position="top-center"
            reverseOrder={false}
          />

        </Providers>

      </body>

    </html>

  );

}