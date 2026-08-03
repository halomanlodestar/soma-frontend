/** @format */

import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NotFoundQuote } from "@/components/common/NotFoundQuote";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-[calc(100dvh-8rem)] items-center overflow-hidden bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-24 -right-16 size-72 rounded-full border border-border sm:size-96" />
        <div className="absolute top-16 -right-6 size-40 rounded-full bg-secondary sm:size-56" />
        <p className="absolute right-3 bottom-0 font-heading text-[9rem] leading-none -tracking-widest text-muted sm:right-12 sm:text-[16rem] lg:text-[22rem]">
          404
        </p>
      </div>

      <div className="mx-auto w-full max-w-7xl">
        <section className="max-w-2xl">
          <div className="flex size-12 items-center justify-center rounded-full bg-accent text-primary">
            <Compass className="size-6" aria-hidden="true" />
          </div>
          <p className="mt-8 text-xs font-medium uppercase tracking-[0.16em] text-primary">
            A small detour
          </p>
          <NotFoundQuote />
          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            This page has wandered off, moved somewhere new, or never quite made
            it into the world. There is still plenty worth discovering nearby.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/explore">
                Explore Soma
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/">Return home</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
