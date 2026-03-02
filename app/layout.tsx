import type { Metadata } from "next";
import { Inter, Space_Grotesk, Geist_Mono, Oswald } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const _inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const _spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});
const _geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});
const _oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: "Sirou — Define routes once. Navigate everywhere.",
  description:
    "Sirou (Simple Router) is a framework-agnostic, universal routing and navigation engine for TypeScript. Define navigation once, run it anywhere — from Next.js servers to React Native mobile apps.",
  metadataBase: new URL("https://sirou.dev"),
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [{ rel: "mask-icon", url: "/icon.svg" }],
  },
  openGraph: {
    title: "Sirou — Define routes once. Navigate everywhere.",
    description:
      "Sirou (Simple Router) is a framework-agnostic, universal routing and navigation engine for TypeScript.",
    url: "https://sirou.dev",
    siteName: "Sirou",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sirou — Define routes once. Navigate everywhere.",
    description:
      "Sirou (Simple Router) is a framework-agnostic, universal routing and navigation engine for TypeScript.",
  },
};

import { DotPattern } from "@/components/ui/dot-pattern";
import { Particles } from "@/components/ui/particles";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${_inter.variable} ${_spaceGrotesk.variable} ${_geistMono.variable} ${_oswald.variable} font-sans antialiased relative min-h-screen bg-black`}
      >
        <div className="relative z-10">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
