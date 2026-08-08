/** @format */

import { Skeleton } from "@/components/ui/skeleton";

export function NotificationsSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="h-10 w-52" />
      <Skeleton className="h-5 w-80" />

      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton className="h-28 w-full" key={index} />
      ))}
    </div>
  );
}
