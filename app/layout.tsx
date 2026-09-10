import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
  metadataBase: new URL("https://luckypennygaming.com"),
  title: {
    default: "Lucky Penny Gaming | Learn Casino Games by Playing",
    template: "%s | Lucky Penny Gaming",
  },
  description:
    "Practice casino games by actually playing them. Play and learn craps and blackjack at Lucky Penny Gaming.",
  applicationName: "Lucky Penny Gaming",
  category: "education",
  keywords: [
    "learn blackjack",
    "blackjack basic strategy",
    "learn craps",
    "craps practice",
    "casino game simulator",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Lucky Penny Gaming",
    title: "Lucky Penny Gaming | Learn Casino Games by Playing",
    description:
      "Free casino-game practice tables, plain-English guides, and strategy coaching for blackjack and craps.",
    url: "/",
    images: [
      {
        url: "/lucky-penny-dogs-logo.png",
        width: 1374,
        height: 1145,
        alt: "Lucky and Penny, the Lucky Penny Gaming mascots",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lucky Penny Gaming | Learn Casino Games by Playing",
    description:
      "Free blackjack and craps practice tables with practical guides and strategy coaching.",
    images: ["/lucky-penny-dogs-logo.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Lucky Penny Gaming",
    url: "https://luckypennygaming.com",
    description:
      "Free casino-game practice tables, guides, and strategy coaching for blackjack and craps.",
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
