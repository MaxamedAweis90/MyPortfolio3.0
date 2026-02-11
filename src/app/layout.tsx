// app/layout.js
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.css";
import LayoutWrapper from "./components/LayoutWrapper";
import Script from "next/script"; // ✅ Import this from Next.js

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mohamed Aweys – Developer & Designer",
  description: "Explore Mohamed Aweis’s portfolio, projects and design gallery.",
  metadataBase: new URL("https://engaweis.space"),
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Mohamed Aweys – Developer & Designer",
    description: "Explore Mohamed Aweis’s portfolio, projects and design gallery.",
    url: "https://engaweis.space",
    siteName: "EngAweis",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mohamed Aweys – Developer & Designer",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohamed Aweys – Developer & Designer",
    description: "Explore Mohamed Aweis’s portfolio, projects and design gallery.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Google Analytics Scripts */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-Z3BYCZVYN0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Z3BYCZVYN0');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
