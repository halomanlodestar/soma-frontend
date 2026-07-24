/** @format */

"use client";

import { use } from "react";
import { useGetSomaBySlug } from "@/modules/soma/api/useGetSomaBySlug";
import { useGetPosts } from "@/modules/post/api/useGetPosts";
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
  const { data: posts, isLoading: postsLoading } = useGetPosts();

  return (
    <div className="flex flex-col min-h-screen bg-background pb-12">
      {/* The Hero Section */}
      <SomaHeader soma={soma} isLoading={somaLoading} />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 mt-8">
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2 md:w-auto md:inline-flex bg-transparent p-0 border-b border-border/40 rounded-none h-auto">
            <TabsTrigger
              value="feed"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-6 text-base"
            >
              Feed
            </TabsTrigger>
            <TabsTrigger
              value="rules"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-6 text-base"
            >
              Rules & Guidelines
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="feed"
            className="mt-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Main Content Column */}
              <div className="flex flex-col gap-6 lg:col-span-8">
                {postsLoading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex flex-col gap-5 rounded-xl border border-border/40 bg-card p-6 shadow-sm"
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
                  : posts?.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
              </div>

              {/* Context Column (Rules summary) */}
              <div className="hidden lg:flex flex-col gap-6 lg:col-span-4">
                <div className="sticky top-8 flex flex-col gap-6">
                  <div className="rounded-xl border border-border/40 bg-card p-5 shadow-sm">
                    <h3 className="font-semibold text-foreground mb-2">
                      About s/{soma?.slug}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {soma?.description}
                    </p>
                    <div className="mt-4 pt-4 border-t border-border/40 text-xs text-muted-foreground">
                      Created Jul 2026
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="rules"
            className="mt-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <div className="max-w-3xl flex flex-col gap-6">
              <div className="rounded-xl border border-border/40 bg-card p-8 shadow-sm">
                <h3 className="font-heading text-xl font-bold mb-6">
                  Community Guidelines
                </h3>
                <ul className="space-y-6 text-sm text-muted-foreground">
                  <li>
                    <strong className="text-foreground block mb-1">
                      1. Human Art Only
                    </strong>
                    Strictly no generative AI art. Process pictures or layered
                    files may be requested by moderators.
                  </li>
                  <li>
                    <strong className="text-foreground block mb-1">
                      2. Constructive Critique
                    </strong>
                    Feedback should elevate the artist. Toxicity results in an
                    immediate ban.
                  </li>
                  <li>
                    <strong className="text-foreground block mb-1">
                      3. Proper Attribution
                    </strong>
                    If you are referencing another creator&apos;s piece, link to
                    their original work.
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
