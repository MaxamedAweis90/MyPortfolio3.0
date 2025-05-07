// app/studio/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css"; // Assuming global styles are here
import CustomCursor from "../components/CustomCursor";

// Define fonts for layout
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Studio | EngAweis",
  description: "Studio section of EngAweis' portfolio.",
};

export default function StudioLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
