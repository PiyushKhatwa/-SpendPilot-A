import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://spendpilot.ai"),
  title: {
    default: "SpendPilot AI | AI Spend Audit Platform",
    template: "%s | SpendPilot AI",
  },
  description:
    "Audit AI subscriptions, uncover waste, and generate a shareable savings report for modern teams.",
  applicationName: "SpendPilot AI",
  authors: [{ name: "SpendPilot AI" }],
  keywords: [
    "AI spend audit",
    "SaaS spend management",
    "AI subscriptions",
    "OpenAI cost optimization",
    "startup finance",
  ],
  openGraph: {
    title: "SpendPilot AI",
    description:
      "A premium AI spend audit platform for subscription and API optimization.",
    url: "https://spendpilot.ai",
    siteName: "SpendPilot AI",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SpendPilot AI spend audit dashboard preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendPilot AI",
    description:
      "Find overspending opportunities across AI subscriptions and API tools.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#07110d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
