"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-12 sm:px-6">
      <div className="border-y border-border py-12">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">Something went wrong</p>
        <h1 className="mt-3 font-heading text-4xl font-medium tracking-[-0.04em] text-foreground">That page could not be reached.</h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">Try again in a moment. If the problem continues, let us know so we can look into it.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button onClick={reset}><RefreshCw data-icon="inline-start" />Try again</Button>
          <Button variant="outline" asChild><Link href="/contact">Contact support</Link></Button>
        </div>
      </div>
    </main>
  );
}
