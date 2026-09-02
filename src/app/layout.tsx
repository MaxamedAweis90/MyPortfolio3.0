// app/layout.js
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./styles/globals.css";
import LayoutWrapper from "./components/LayoutWrapper";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mohamed Aweys – Software Engineer & Full-Stack Developer",
  description:
    "Explore Mohamed Aweys’s software engineering portfolio, production web and mobile apps.",
  metadataBase: new URL("https://engaweis.space"),
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Mohamed Aweys – Software Engineer & Full-Stack Developer",
    description:
      "Explore Mohamed Aweys’s software engineering portfolio, production web and mobile apps.",
    url: "https://engaweis.space",
    siteName: "EngAweis",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mohamed Aweys – Software Engineer & Full-Stack Developer",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohamed Aweys – Software Engineer & Full-Stack Developer",
    description:
      "Explore Mohamed Aweys’s software engineering portfolio, production web and mobile apps.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable}`}
    >
      <head>
        {/* ✅ Remix Icons CDN */}
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css"
          rel="stylesheet"
        />
        {/* ✅ Anime.js CDN Script - deferred to avoid render blocking */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"
          strategy="lazyOnload"
        />
        {/* ✅ Google Analytics Scripts - deferred to lazyOnload */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-Z3BYCZVYN0"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Z3BYCZVYN0');
          `}
        </Script>
      </head>
      <body className="antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
