/** @format */

import Image from "next/image";
import { ShieldCheck, Users } from "lucide-react";
import { Soma } from "@/modules/soma/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface SomaHeaderProps {
  soma: Soma | null;
  isLoading: boolean;
}

export function SomaHeader({ soma, isLoading }: SomaHeaderProps) {
  if (isLoading || !soma) {
    return (
      <div className="border-b border-border">
        <Skeleton className="h-44 w-full rounded-none sm:h-56" />
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 py-7 sm:py-9">
            <Skeleton className="h-3 w-24" />
            <div className="flex flex-col gap-3">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-5 w-44" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formattedCreators = new Intl.NumberFormat("en-US", {
    notation: "compact",
  }).format(soma.memberCount);

  return (
    <section className="border-b border-border bg-background">
      <div className="relative h-44 w-full overflow-hidden bg-muted sm:h-56">
        {soma.coverUrl && (
          <Image
            src={soma.coverUrl}
            alt={`${soma.name} cover`}
            fill
            className="object-cover object-center"
            priority
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/10 to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-7 py-7 sm:py-9 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-medium tracking-[0.14em] text-primary uppercase">
              s/{soma.slug}
            </p>
            <h1 className="mt-3 font-heading text-4xl font-medium leading-none tracking-[-0.04em] text-foreground sm:text-5xl">
              {soma.name}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              {soma.description}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Users className="size-4 text-primary" />
                {formattedCreators} creators
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                Curated with care
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <Button className="px-5">
              Join Soma
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
