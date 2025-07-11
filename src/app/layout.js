import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Canonical from "@/components/seo/Canonical";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const metadata = {
  metadataBase: new URL(siteUrl), // Replace with your real domain
  title: "Pokiifuns",
  description:
    "Pokiifuns: Your ultimate gaming destination! Explore a vast collection of thrilling games, from action-packed adventures to brain-teasing puzzles. Dive into a world of fun and challenge your skills on Pokiifuns today!",
  applicationName: "Pokiifuns",
  authors: [{ name: "Pokiifuns Team", url: siteUrl }],
  generator: "Next.js 15",
  keywords: [
    "online games",
    "free games",
    "puzzle games",
    "action games",
    "Pokiifuns",
  ],
  openGraph: {
    title: "Pokiifuns",
    description:
      "Play free online games instantly! From action to puzzle, enjoy the best casual gaming at Pokiifuns.",
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
    title: "Pokiifuns",
    description:
      "Play free online games instantly! From action to puzzle, enjoy the best casual gaming at Pokiifuns.",
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
  themeColor: "#ffffff",
  viewport: "width=device-width, initial-scale=1",
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* <meta
          name="description"
          content="Pokiifuns: Your ultimate gaming destination! Explore a vast collection of thrilling games, from action-packed adventures to brain-teasing puzzles. Dive into a world of fun and challenge your skills on Pokiifuns today!"
        /> */}
        <link
          href="https://fonts.googleapis.com/css2?family=Dosis:wght@200..800&family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Canonical />
        <Header />
        <div className="min-h-screen"> {children}</div>

        <Footer />
      </body>
    </html>
  );
}
