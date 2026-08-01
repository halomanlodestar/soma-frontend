/** @format */

import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/components/providers";
import { absoluteUrl, siteConfig } from "@/lib/metadata";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-heading",
});
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Soma — Human creativity, in company",
    template: "%s | Soma",
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Soma — Human creativity, in company",
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Soma — A home for work made by people.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Soma — Human creativity, in company",
    description: siteConfig.description,
    images: ["/opengraph-image"],
  },
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: absoluteUrl(),
    description: siteConfig.description,
    logo: absoluteUrl("/favicon.ico"),
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: absoluteUrl(),
    description: siteConfig.description,
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable, lora.variable)} suppressHydrationWarning>
      <body className="antialiased font-sans bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
        <Providers>
          {children}
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
