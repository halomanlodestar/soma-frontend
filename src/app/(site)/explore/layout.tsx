import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Explore",
  description: "Find thoughtful work, creators, and communities on Soma.",
  path: "/explore",
});

export default function ExploreLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
