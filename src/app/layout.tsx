
import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Image to PDF | Free, Private & Easy",
    template: "%s | Image to PDF",
  },
  description:
    "Convert multiple images into one PDF directly in your browser. Free, private, and easy to use. Your images never leave your device.",
  applicationName: "Image to PDF",
  keywords: [
    "image to PDF",
    "convert images to PDF",
    "JPG to PDF",
    "PNG to PDF",
    "private PDF converter",
    "free image converter",
  ],
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    title: "Image to PDF | Free, Private & Easy",
    description:
      "Convert multiple images into one PDF directly in your browser. Your images never leave your device.",
    siteName: "Image to PDF",
  },
  twitter: {
    card: "summary",
    title: "Image to PDF | Free, Private & Easy",
    description:
      "Convert multiple images into one PDF directly in your browser. No uploads. No account required.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
