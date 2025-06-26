import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
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
  title: "El Blog del CEO - Reflexiones personales y empresariales",
  description:
    "Blog personal y empresarial con reflexiones sobre liderazgo, innovación y Electric Automatic Chile.",
  keywords: [
    "blog",
    "CEO",
    "liderazgo",
    "innovación",
    "Electric Automatic Chile",
    "emprendimiento",
  ],
  authors: [{ name: "CEO" }],
  openGraph: {
    title: "El Blog del CEO",
    description:
      "Reflexiones personales y empresariales sobre liderazgo e innovación",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen flex flex-col`}
      >
        <Navigation />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
