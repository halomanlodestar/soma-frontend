import type { Metadata } from "next";

import { privatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Notifications",
  ...privatePageMetadata,
};

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
