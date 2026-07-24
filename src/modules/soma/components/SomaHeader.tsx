/** @format */

import Image from "next/image";
import { Users, ShieldCheck } from "lucide-react";
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
      <div className="w-full flex flex-col">
        <Skeleton className="h-48 md:h-64 w-full rounded-none" />
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6">
            <div className="flex flex-col gap-4">
              <Skeleton className="size-24 rounded-xl border-4 border-background" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
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
    <div className="w-full flex flex-col border-b border-border/40 bg-background">
      {/* Massive Banner (Parallax aesthetic) */}
      <div className="relative h-48 md:h-72 w-full overflow-hidden bg-muted">
        {soma.coverUrl && (
          <Image
            src={soma.coverUrl}
            alt={`${soma.name} cover`}
            fill
            className="object-cover object-center opacity-90"
            priority
          />
        )}
        {/* Soft gradient fade into the background color */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-6 z-10">
            {/* Soma Avatar/Icon */}
            <div className="size-24 md:size-32 shrink-0 rounded-2xl border-4 border-background bg-card shadow-xl overflow-hidden relative">
              {soma.coverUrl ? (
                <Image
                  src={soma.coverUrl}
                  alt="icon"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl">
                  {soma.name.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1 pb-1">
              <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-foreground flex items-center gap-2">
                {soma.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-muted-foreground mt-1">
                <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                  s/{soma.slug}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="size-4" />
                  {formattedCreators} creators
                </span>
                <span className="flex items-center gap-1.5 text-green-600/80 dark:text-green-500/80">
                  <ShieldCheck className="size-4" />
                  Curated
                </span>
              </div>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="flex items-center gap-3 z-10 pb-1">
            <Button variant="outline" className="font-semibold shadow-sm">
              About
            </Button>
            <Button className="font-semibold shadow-sm rounded-full px-6">
              Join Soma
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
