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
  title: "Sirou - Define routes once. Navigate everywhere.",
  description:
    "Define routes once. Navigate everywhere. Sirou is a universal routing library for React, Next.js, React Native, and Svelte.",
  icons: {
    icon: "/image/sirouwhite.png",
    apple: "/image/sirouwhite.png",
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
