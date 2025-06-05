import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-opensans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alcamo Inmobiliaria | Propiedades Premium",
  description: "Encuentra tu hogar ideal con Alcamo Inmobiliaria. Propiedades premium en las mejores ubicaciones.",
  keywords: "inmobiliaria, propiedades, casas, departamentos, terrenos, bienes raíces",
  authors: [{ name: "Alcamo Inmobiliaria" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://alcamoinmo.com",
    siteName: "Alcamo Inmobiliaria",
    title: "Alcamo Inmobiliaria | Propiedades Premium",
    description: "Encuentra tu hogar ideal con Alcamo Inmobiliaria. Propiedades premium en las mejores ubicaciones.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} ${openSans.variable}`}>
      <body className="font-opensans bg-brand-white text-brand-gray-900 antialiased">
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
