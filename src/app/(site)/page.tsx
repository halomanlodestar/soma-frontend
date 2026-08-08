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
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-10 flex flex-col justify-between gap-5 border-b border-border pb-8 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-primary">
            A quieter place for art
          </p>
          <h1 className="font-heading text-4xl font-medium tracking-[-0.055em] text-foreground sm:text-5xl">
            Made by people.
            <br />
            Given room to breathe.
          </h1>
        </div>
        <p className="max-w-xs text-sm leading-6 text-muted-foreground">
          A considered feed of work, process, and conversation—without the
          endless noise.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Main Content Column (Primary Flow) */}
        <section className="flex min-w-0 flex-col gap-4 lg:col-span-8">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-medium tracking-[-0.04em]">
              Latest work
            </h2>
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Take your time
            </span>
          </div>

          <div className="flex flex-col">
            {postsLoading
              ? // Skeleton loaders mimicking PostCard
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-5 border-b border-border py-10 first:pt-2"
                  >
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
              : posts?.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        </section>

        {/* Context Column (Metadata & Actions) */}
        <div className="flex flex-col gap-8 lg:col-span-4">
          <div className="sticky top-20 flex flex-col gap-8">
            {/* Featured Communities */}
            <div className="flex flex-col gap-3">
              <h2 className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                Discover Somas
              </h2>
              <div className="flex flex-col gap-2">
                {somasLoading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4 p-2">
                        <Skeleton className="size-11 rounded-full shrink-0" />
                        <div className="flex flex-col gap-2 w-full">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                      </div>
                    ))
                  : somas?.map((soma) => (
                      <SomaCard key={soma.id} soma={soma} />
                    ))}
              </div>
            </div>

            {/* Apply Banner */}
            <div className="flex flex-col items-start gap-3 rounded-2xl bg-primary p-6 text-left text-primary-foreground">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary-foreground/70">
                Your work belongs here
              </p>
              <h3 className="font-heading text-2xl font-medium tracking-[-0.04em]">
                Are you a creator?
              </h3>
              <p className="text-sm leading-6 text-primary-foreground/70">
                Join the sanctuary. Apply to verify your craft and share your
                work.
              </p>
              <button className="mt-2 text-sm font-medium text-primary-foreground underline-offset-4 hover:underline">
                Apply for Creatorship →
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
