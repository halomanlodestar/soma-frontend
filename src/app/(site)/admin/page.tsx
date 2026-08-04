/** @format */

import type { Metadata } from "next";

import { CreatorApplicationReviewQueue } from "@/modules/application/components/CreatorApplicationReviewQueue";

export const metadata: Metadata = {
  title: "Creator review",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <CreatorApplicationReviewQueue />
    </main>
  );
}
