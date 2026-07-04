import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Seam Salty — Organic Luxury Atelier",
  description:
    "Objects shaped by salt air, softened edges, and the quiet intelligence of material. A coastal atelier creating sculptural, tactile, organic luxury pieces for refined interiors.",
  openGraph: {
    title: "Seam Salty — Organic Luxury Atelier",
    description:
      "A coastal atelier creating sculptural, tactile, organic luxury pieces for refined interiors.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
