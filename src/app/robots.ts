import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/metadata";

const privatePaths = [
  "/api/",
  "/auth/",
  "/login",
  "/settings",
  "/create",
  "/create-community",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Training crawlers are blocked by policy. AI answer/search crawlers are
      // intentionally not listed here until Soma makes a separate discovery decision.
      {
        userAgent: ["GPTBot", "ClaudeBot", "CCBot", "Bytespider"],
        disallow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: privatePaths,
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
