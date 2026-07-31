import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Valdes fête ses 22 ans",
  description:
    "Rejoins Valdes Banhatio pour célébrer ses 22 ans le lundi 3 août — livre d'or, cagnotte, gâteau et souvenirs.",
  openGraph: {
    title: "Valdes fête ses 22 ans",
    description:
      "Rejoins Valdes Banhatio pour célébrer ses 22 ans — livre d'or, cagnotte, gâteau et souvenirs.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#180e22",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${manrope.variable} ${spaceMono.variable}`}>
      <body className="font-body antialiased">
        <div className="grain-overlay" aria-hidden="true" />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
