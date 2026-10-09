import type { Metadata } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Marquee from "./components/Marquee";
import { Toaster } from "react-hot-toast";

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["latin", "bengali"],
});

export const metadata: Metadata = {
  title: "বাজার দর",
  description: "আপনার নিত্যপ্রয়োজনীয় পণ্যের সর্বশেষ বাজারদর",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      data-theme="light"
      lang="en"
      className={`${notoSansBengali.className}  h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <Marquee />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#fbfcfa",
              color: "#202820",
              border: "1px solid #e2e9e1",
              borderRadius: "12px",
              fontSize: "14px",
              padding: "12px 16px",
            },
            success: {
              iconTheme: {
                primary: "#078b45",
                secondary: "#ffffff",
              },
            },
            error: {
              iconTheme: {
                primary: "#dc2626",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
