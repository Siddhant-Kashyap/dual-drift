import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dual Drift – 3D Dual Control Racing Game",
  description:
    "Play Dual Drift, a fast-paced yet relaxing 3D endless racing game where you control two cars at once. A challenging but satisfying browser game: collect blue orbs, dodge red hazards, and chase high scores.",
  keywords: [
    "Dual Drift",
    "3D racing game",
    "endless runner",
    "browser racing game",
    "free browser game",
    "keyboard racing game",
    "dual control game",
    "two car game",
    "reflex game",
    "arcade racing",
    "challenging game",
    "relaxing game",
    "stress relief game",
    "high score game",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
