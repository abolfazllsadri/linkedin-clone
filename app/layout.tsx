import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  fallback: ["Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Linkedin Clone",
    default: "Feed | Linkedin Clone",
  },
  description: "This is a simple Linkedin clone build with Next.js",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.className} h-full scrollbar-thin antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-[#f4f2ed]">
        <ClerkProvider>
          <Toaster position="bottom-left" />

          <header className="sticky top-0 z-50 w-full border-b border-b-gray-100 bg-white shadow-sm">
            <Header />
          </header>

          <div className="mx-auto w-full max-w-6xl flex-1">
            <main>{children}</main>
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
