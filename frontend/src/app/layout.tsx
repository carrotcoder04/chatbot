import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PTIT Chatbot — Tư vấn Tuyển sinh",
  description: "Hệ thống tư vấn tuyển sinh thông minh Học viện Công nghệ Bưu chính Viễn thông",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" style={{ colorScheme: "light", background: "var(--bg-base)" }}>
      <body className={`${inter.variable} antialiased`} style={{ background: "var(--bg-base)" }}>
        {children}
      </body>
    </html>
  );
}
