import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fonte = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ZH Informática — Tecnologia em Faxinal dos Guedes/SC",
    template: "%s | ZH Informática",
  },
  description:
    "Apple, Xiaomi, JBL, HP, ASUS, ACER, PS5, Starlink, notebooks, periféricos e móveis para escritório. Assistência técnica especializada em Faxinal dos Guedes - SC.",
  keywords: [
    "informática Faxinal dos Guedes",
    "assistência técnica SC",
    "iPhone",
    "notebook",
    "PS5",
    "Starlink",
    "JBL",
  ],
  openGraph: {
    title: "ZH Informática",
    description:
      "Tecnologia, games e assistência técnica em Faxinal dos Guedes - SC.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${fonte.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
