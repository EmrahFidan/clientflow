import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ClientFlow - Proje Yönetim Paneli",
    template: "%s | ClientFlow",
  },
  description: "Yaratıcı ajanslar için müşteri proje yönetim sistemi. Projelerinizi müşterilerinizle şeffaf bir şekilde paylaşın.",
  keywords: ["proje yönetimi", "ajans", "müşteri portalı", "timeline", "proje takip"],
  authors: [{ name: "ClientFlow" }],
  creator: "ClientFlow",
  publisher: "ClientFlow",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "ClientFlow",
    title: "ClientFlow - Proje Yönetim Paneli",
    description: "Yaratıcı ajanslar için müşteri proje yönetim sistemi",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClientFlow - Proje Yönetim Paneli",
    description: "Yaratıcı ajanslar için müşteri proje yönetim sistemi",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="light" data-theme="light" style={{ colorScheme: 'light' }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--color-bg-warm)] text-[var(--color-text)]`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
