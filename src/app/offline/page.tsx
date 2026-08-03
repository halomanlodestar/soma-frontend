"use client";

import Link from "next/link";
import { RefreshCw, WifiOff } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  const router = useRouter();
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-12 sm:px-6">
      <div className="border-y border-border py-12"><WifiOff className="size-6 text-primary" aria-hidden="true" /><p className="mt-5 text-xs font-medium uppercase tracking-[0.16em] text-primary">You are offline</p><h1 className="mt-3 font-heading text-4xl font-medium tracking-[-0.04em] text-foreground">Soma will be here when you reconnect.</h1><p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">Check your connection, then retry this page.</p><div className="mt-7 flex flex-wrap gap-3"><Button onClick={() => router.refresh()}><RefreshCw data-icon="inline-start" />Retry</Button><Button variant="outline" asChild><Link href="/">Go home</Link></Button></div></div>
    </main>
  );
}
