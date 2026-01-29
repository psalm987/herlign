import type { Metadata } from "next";
import { axiforma, clashDisplay, gochiHand } from "./fonts";
import { QueryProvider } from "@/lib/tanstack/provider";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Herlign FC",
  description: "Herlign FC - Official Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${axiforma.variable} ${clashDisplay.variable} ${gochiHand.variable} font-sans antialiased`}
      >
        <QueryProvider>
          {children}
          <Toaster position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
