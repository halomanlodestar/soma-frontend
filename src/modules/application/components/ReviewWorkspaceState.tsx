import { ClipboardCheck } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ReviewWorkspaceState({
  title,
  description,
  compact = false,
}: {
  title: string;
  description: string;
  compact?: boolean;
}) {
  return (
    <section
      className={cn(
        "flex flex-col items-center border-y border-border text-center",
        compact ? "py-16" : "mt-8 py-20",
      )}
    >
      <ClipboardCheck className="size-6 text-primary" />
      <h2 className="mt-5 font-heading text-2xl font-medium tracking-[-0.03em]">
        {title}
      </h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </section>
  );
}

export function ReviewWorkspaceSkeleton() {
  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-18 w-full" />
        <Skeleton className="h-18 w-full" />
      </div>
      <div className="flex flex-col gap-5">
        <Skeleton className="h-12 w-56" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}
