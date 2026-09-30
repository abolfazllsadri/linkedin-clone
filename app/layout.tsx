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
      <body className="flex min-h-screen min-w-0 flex-col overflow-x-clip bg-[#f4f2ed]">
        <ClerkProvider>
          <Toaster position="bottom-left" />

          <div className="sticky top-0 z-50 w-full border-b border-b-gray-100 bg-white shadow-sm">
            <Header />
          </div>

          <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-1">
            <main className="w-full min-w-0">{children}</main>
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
