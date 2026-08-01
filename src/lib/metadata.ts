/** @format */

import type { Metadata } from "next";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const siteConfig = {
  name: "Soma",
  description: "A home for work made by people.",
  url: configuredSiteUrl ?? "http://localhost:3000",
  locale: "en_US",
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  imageUrl?: string | null;
  imageAlt?: string;
  robots?: Metadata["robots"];
};

export function createPageMetadata({
  title,
  description,
  path,
  imageUrl,
  imageAlt,
  robots,
}: PageMetadataOptions): Metadata {
  const socialImage = imageUrl ?? "/opengraph-image";
  const socialImageAlt = imageAlt ?? "Soma — A home for work made by people.";

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: socialImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
    robots,
  };
}

export const privatePageMetadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export function stringifyJsonLd(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
