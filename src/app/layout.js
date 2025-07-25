import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Canonical from "@/components/seo/Canonical";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { keyword } from "../components/Constant";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.pokiifuns.com/";
export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Free Online Games at Pokiifuns | Play Fun Web Games Now",
  description:
    "Play free online games at Pokiifuns! Enjoy fun games to play online without downloading—cool web games, browser games, mobile games & more, all for free!",
  authors: [{ name: "Pokiifuns Team", url: siteUrl }],
  generator: "Next.js 15",
  keywords: keyword,
  openGraph: {
    title: "Free Online Games at Pokiifuns | Play Fun Web Games Now",
    description:
      "Play free online games instantly at Pokiifuns! From action-packed adventures to relaxing puzzle games, enjoy top titles in your browser.",
    url: siteUrl,
    siteName: "Pokiifuns",
    images: [
      {
        url: "/assets/pokii_game.webp",
        width: 1200,
        height: 630,
        alt: "Pokiifuns - Play Free Online Games",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Games at Pokiifuns | Play Fun Web Games Now",
    description:
      "Discover top-rated free online games at Pokiifuns. Play action, puzzle, and casual games instantly—fun for all ages!",
    images: ["/assets/pokii_game.webp"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: [
      { url: "/apple-icon.png" },
      { url: "/apple-icon-180x180.png", sizes: "180x180" },
      { url: "/apple-icon-152x152.png", sizes: "152x152" },
      { url: "/apple-icon-144x144.png", sizes: "144x144" },
    ],
    other: [
      { rel: "manifest", url: "/manifest.json" },
      { rel: "mask-icon", url: "/apple-icon-precomposed.png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const themeColor = '#ffffff';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-FGE8FDPWWR"
        ></Script>
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FGE8FDPWWR');
          `}
        </Script>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        {/* <meta
          name="description"
          content="Pokiifuns: Your ultimate gaming destination! Explore a vast collection of thrilling games, from action-packed adventures to brain-teasing puzzles. Dive into a world of fun and challenge your skills on Pokiifuns today!"
        /> */}

        <link
          href="https://fonts.googleapis.com/css2?family=Dosis:wght@200..800&family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
        <script async custom-element="amp-auto-ads"
          src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js">
        </script>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7456682660420004"
          crossorigin="anonymous"></script>
        <meta
          name="google-site-verification"
          content="e5ZBxpONbcJKU43Gd6trEKK_lenX9e-rYcAJ8Yqp6uQ"
        />
        <meta
          name="google-adsense-account"
          content="ca-pub-7456682660420004"
        ></meta>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3785390617142950"
          crossorigin="anonymous"
        ></script>
        {/* <script
          src="https://cmp.gatekeeperconsent.com/min.js"
          data-cfasync="false"
        ></script>
        <script
          src="https://the.gatekeeperconsent.com/cmp.min.js"
          data-cfasync="false"
        ></script> */}

        <script async src="https://www.googletagmanager.com/gtag/js?id=G-FGE8FDPWWR"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-FGE8FDPWWR');
          `,
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <amp-auto-ads type="adsense"
          data-ad-client="ca-pub-7456682660420004">
        </amp-auto-ads>
        {/* ✅ GTM fallback for non-JS users */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5FC7Z8WT"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <Canonical />
        <SchemaMarkup />
        <Header />

        <div className=""> {children}</div>

        <Footer />
      </body>
    </html>
  );
}