/** @format */

"use client";

import { useGetPosts } from "@/modules/post/api/useGetPosts";
import { useGetSomas } from "@/modules/soma/api/useGetSomas";
import { PostCard } from "@/components/common/PostCard";
import { SomaCard } from "@/components/common/SomaCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeFeedPage() {
  const { data: posts, isLoading: postsLoading } = useGetPosts();
  const { data: somas, isLoading: somasLoading } = useGetSomas();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* 2-Column Editorial Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Main Content Column (Primary Flow) */}
        <div className="flex flex-col gap-6 lg:col-span-8">
          <div className="mb-2 flex flex-col gap-1">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">Home</h1>
            <p className="text-sm text-muted-foreground">Curated human artistry, verified and pure.</p>
          </div>

          <div className="flex flex-col gap-6">
            {postsLoading ? (
              // Skeleton loaders mimicking PostCard
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-5 rounded-xl border border-border/40 bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-9 rounded-full" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-2 w-24" />
                    </div>
                  </div>
                  <Skeleton className="mt-2 h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="mt-2 aspect-video w-full rounded-xl" />
                </div>
              ))
            ) : (
              posts?.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </div>

        {/* Context Column (Metadata & Actions) */}
        <div className="flex flex-col gap-8 lg:col-span-4">
          <div className="sticky top-8 flex flex-col gap-8">
            
            {/* Featured Communities */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Discover Somas
              </h2>
              <div className="flex flex-col gap-2">
                {somasLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-2">
                      <Skeleton className="size-11 rounded-full shrink-0" />
                      <div className="flex flex-col gap-2 w-full">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                  ))
                ) : (
                  somas?.map((soma) => (
                    <SomaCard key={soma.id} soma={soma} />
                  ))
                )}
              </div>
            </div>

            {/* Apply Banner */}
            <div className="flex flex-col items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
              <h3 className="font-semibold text-foreground">Are you a creator?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Join the sanctuary. Apply to verify your craft and share your work.
              </p>
              <button className="mt-2 text-sm font-medium text-primary underline-offset-4 hover:underline">
                Apply for Creatorship &rarr;
              </button>
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  );
}
