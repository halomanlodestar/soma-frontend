import type { Metadata } from "next";

import { CreatorApplicationStatus } from "@/modules/application/components/CreatorApplicationStatus";

export const metadata: Metadata = {
  title: "Application status",
  robots: { index: false, follow: false },
};

export default function ApplicationStatusPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="max-w-2xl border-b border-border pb-8">
        <p className="text-sm font-medium text-primary">Creator application</p>
        <h1 className="mt-3 font-heading text-4xl font-medium tracking-[-0.04em] text-foreground sm:text-5xl">
          Your applications
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
          A clear record of where each application stands, and any note a reviewer has left for you.
        </p>
      </header>
      <section className="pt-9 sm:pt-11">
        <CreatorApplicationStatus />
      </section>
    </main>
  );
}
