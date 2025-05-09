import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.css";
import LayoutWrapper from "./components/LayoutWrapper"; // Import LayoutWrapper

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EngAweis",
  description:
    "This is the Portfolio of EngAweis 'Mohamed Aweys Iiman' a Software Engineer, Graphic Designer, Content Creator",
};

export default function RootLayout({ children }) {

  const seoData = {
    title: 'Mohamed Aweys – Developer & Designer',
    description: 'Explore Mohamed’s projects, blog posts, and design gallery.',
    url: 'https://yourdomain.com',
    image: 'https://yourdomain.com/og-image.jpg', // Replace with your image URL
  };
  
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LayoutWrapper>{children}</LayoutWrapper> {/* Wrap children with LayoutWrapper */}
      </body>
    </html>
  );
}
