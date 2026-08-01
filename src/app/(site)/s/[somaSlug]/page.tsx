/** @format */

"use client";

import { use } from "react";
import { useGetSomaBySlug } from "@/modules/soma/api/useGetSomaBySlug";
import { useGetSomaFeed } from "@/modules/post/api/useGetSomaFeed";
import { SomaHeader } from "@/modules/soma/components/SomaHeader";
import { PostCard } from "@/components/common/PostCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface PageProps {
  params: Promise<{ somaSlug: string }>;
}

export default function SomaPage({ params }: PageProps) {
  // Unwrap params using React 19 `use`
  const { somaSlug } = use(params);

  const { data: soma, isLoading: somaLoading } = useGetSomaBySlug(somaSlug);
  const { data: somaPosts, isLoading: postsLoading } = useGetSomaFeed(soma?.id);

  return (
    <div className="min-h-screen bg-background pb-16">
      <SomaHeader soma={soma} isLoading={somaLoading} />

      <div className="mx-auto mt-8 w-full max-w-7xl px-4 sm:mt-10 sm:px-6 lg:px-8">
        <Tabs defaultValue="feed" className="w-full">
          <TabsList variant="pill" className="mb-8 w-full sm:w-fit">
            <TabsTrigger value="feed" className="flex-1 sm:flex-none">
              Feed
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex-1 sm:flex-none">
              Community notes
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="feed"
            className="mt-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="flex flex-col lg:col-span-8">
                <div className="flex items-baseline justify-between border-b border-border pb-4">
                  <h2 className="font-heading text-2xl font-medium tracking-[-0.025em]">
                    Recent work
                  </h2>
                  <span className="text-sm text-muted-foreground">Newest first</span>
                </div>
                {postsLoading
                  ? Array.from({ length: 3 }).map((_, i) => (
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
                        <Skeleton className="mt-2 aspect-video w-full rounded-xl" />
                      </div>
                    ))
                  : somaPosts?.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                {!postsLoading && somaPosts?.length === 0 && (
                  <div className="py-16 text-center">
                    <p className="font-heading text-2xl font-medium">Room for the first work.</p>
                    <p className="mt-2 text-sm text-muted-foreground">This Soma is quiet for now. A good place to begin.</p>
                  </div>
                )}
              </div>

              <aside className="hidden lg:block lg:col-span-4">
                <div className="sticky top-8 border-y border-border py-6">
                  <p className="text-xs font-medium tracking-[0.14em] text-primary uppercase">The room</p>
                  <h3 className="mt-3 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
                    About this Soma
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {soma?.description}
                  </p>
                  <div className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">
                      Created Jul 2026
                  </div>
                </div>
              </aside>
            </div>
          </TabsContent>

          <TabsContent
            value="rules"
            className="mt-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <div className="max-w-3xl border-y border-border py-8 sm:py-10">
                <p className="text-xs font-medium tracking-[0.14em] text-primary uppercase">Shared expectations</p>
                <h2 className="mt-3 font-heading text-3xl font-medium tracking-[-0.03em]">
                  A few ways we keep this room good.
                </h2>
                <ul className="mt-8 space-y-7 text-sm leading-7 text-muted-foreground">
                  <li>
                    <p className="mb-1 font-medium text-foreground">Human art, clearly shared</p>
                    Process pictures or layered files may be requested by moderators.
                  </li>
                  <li>
                    <p className="mb-1 font-medium text-foreground">Critique that helps the work grow</p>
                    Feedback should elevate the artist. There is no place for toxicity here.
                  </li>
                  <li>
                    <p className="mb-1 font-medium text-foreground">Credit travels with the work</p>
                    If you are referencing another creator&apos;s piece, link to
                    their original work.
                  </li>
                </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
