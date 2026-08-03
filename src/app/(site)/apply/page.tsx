import type { Metadata } from "next";

import { CreatorApplicationForm } from "@/modules/application/components/CreatorApplicationForm";

export const metadata: Metadata = {
  title: "Apply for creatorship",
  robots: { index: false, follow: false },
};

export default function ApplyPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <CreatorApplicationForm />
    </main>
  );
}
