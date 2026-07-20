/** @format */

"use client";

import { useFeed } from "@/hooks/useFeed";

export default function FeedPage() {
  const { isLoading, error, data: posts } = useFeed();

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-destructive/10 text-destructive rounded-lg mx-auto max-w-lg mt-8">
        {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Column (Primary) - Width ~2/3 (8 cols) */}
        <main className="lg:col-span-8 flex flex-col min-h-screen">
          <div className="mb-4 px-2">
            <h1 className="text-xl font-bold">Your Feed</h1>
          </div>
        </main>

        {/* Context Column (Secondary) - Width ~1/3 (4 cols) */}
      </div>
    </div>
  );
}
