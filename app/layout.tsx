import type { Metadata } from "next";
import { axiforma, clashDisplay, gochiHand } from "./fonts";
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
        {children}
      </body>
    </html>
  );
}
