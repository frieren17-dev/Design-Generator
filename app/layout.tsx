import type { Metadata } from "next";
import {
  Fraunces,
  Hanken_Grotesk,
  DM_Mono,
  Bricolage_Grotesque,
} from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Display: Fraunces — a soft, characterful "old-style" serif with optical sizing.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

// Body / UI: Hanken Grotesk — a warm, humanist grotesque.
const hanken = Hanken_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Eyebrow labels / meta: DM Mono — adds a "spec-sheet" technical accent.
const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Alternate display: Bricolage Grotesque — characterful for contemporary/dynamic
// type specimens shown on the moodboards.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Design Concept Generator — FrontEnd",
  description:
    "Generate six homepage design concept moodboards from one Idea, Theme, and Products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${hanken.variable} ${dmMono.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="bg-canvas relative min-h-full flex flex-col">
        {/* Atmosphere: warm radial glow + paper grain, behind everything. */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-glow" />
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-grain" />
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
