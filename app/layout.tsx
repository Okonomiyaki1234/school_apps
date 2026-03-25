import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import HeaderSwitcher from "@/components/Header/HeaderSwitcher";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "2026淑徳高校3年生ポータルサイト",
  description: "ポータルサイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <HeaderSwitcher />
          {children}
          {/* 全ページ共通Footer */}
          {/* ログイン・新規登録ページは個別で除外 */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
