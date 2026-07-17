import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prospera | Desarrollos inmobiliarios",
  description: "Explorá La Fortuna, Campo Grande 1, Campo Grande 2 y Campo Grande 3; conocé cada proyecto, revisá su plano y agendá una visita.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

import { PromoPopup } from "../components/promo-popup";
import settings from "../data/settings.json";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const promo = settings.promo;

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PromoPopup promo={promo} />
        {children}
      </body>
    </html>
  );
}
