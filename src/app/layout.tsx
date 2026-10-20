import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const displayFont = localFont({
  src: "./fonts/oswald-700.woff2",
  variable: "--font-display",
  weight: "700",
});

const jpFont = localFont({
  src: [
    { path: "./fonts/noto-sans-jp-400.woff2", weight: "400" },
    { path: "./fonts/noto-sans-jp-700.woff2", weight: "700" }
  ],
  variable: "--font-jp",
});

const monoFont = localFont({
  src: [
    { path: "./fonts/space-mono-400.woff2", weight: "400" },
    { path: "./fonts/space-mono-700.woff2", weight: "700" }
  ],
  variable: "--font-mono",
});

const comicFont = localFont({
  src: "./fonts/comic-neue-700.woff2",
  variable: "--font-comic",
  weight: "700",
});

const lightFont = localFont({
  src: [
    { path: "./fonts/inter-300.woff2", weight: "300" },
    { path: "./fonts/inter-400.woff2", weight: "400" }
  ],
  variable: "--font-light",
});

import AudioPlayer from "@/components/AudioPlayer";

export const metadata: Metadata = {
  title: "SATYA — Photographs",
  description: "Photographs I keep.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${displayFont.variable} ${jpFont.variable} ${monoFont.variable} ${comicFont.variable} ${lightFont.variable} grain`}
      >
        {children}
        <AudioPlayer />
      </body>
    </html>
  );
}
