import { Geist, Geist_Mono} from "next/font/google";
import "./styles/globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";

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
    "This is the Portfolio of EngAweis 'Mohamed Aweys Iiman' a Software Engineer, Graphic Designer, Content Creater",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar />
        {children}
        <CustomCursor />
        <Footer />
      </body>
    </html>
  );
}
