import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Container from "@/components/container";
import { basePath } from '@/constant'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tiny note",
  description: "An note-taking app built with Next.js and React",
  icons: {
    icon: [
      {
        url: basePath + '/favicon.ico',
        href:  basePath + '/favicon.ico',
        type: "image/x-icon"
      },
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Container>{children}</Container>
      </body>
    </html>
  );
}
