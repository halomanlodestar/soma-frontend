import type { Metadata } from "next";

import { privatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Studio",
  ...privatePageMetadata,
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
