// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.css";
import LayoutWrapper from "./components/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mohamed Aweys – Developer & Designer",
  description: "Explore Mohamed Aweis’s portfolio, projects and design gallery.",
  metadataBase: new URL("https://engaweis.space"),
  icons: {
    icon: "/favicon.png",      // <-- point to your PNG
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
