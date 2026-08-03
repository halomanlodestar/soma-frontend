import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="max-w-3xl"><Skeleton className="h-4 w-28" /><Skeleton className="mt-5 h-12 w-4/5" /><Skeleton className="mt-4 h-5 w-full" /></div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><Skeleton className="h-64 w-full" /><Skeleton className="h-64 w-full" /><Skeleton className="h-64 w-full" /></div>
    </main>
  );
}
