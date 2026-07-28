/** @format */

"use client";

import { useState } from "react";
import { Search, Sparkles } from "lucide-react";

import { useGetSomas } from "@/modules/soma/api/useGetSomas";
import { useGetPosts } from "@/modules/post/api/useGetPosts";
import { SomaGridCard } from "@/modules/soma/components/SomaGridCard";
import { PostCard } from "@/components/common/PostCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExplorePage() {
  const { data: somas, isLoading: somasLoading } = useGetSomas();
  const { data: posts, isLoading: postsLoading } = useGetPosts();
  
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredSomas = somas?.filter((soma) =>
    [soma.name, soma.slug, soma.description]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );
  const filteredPosts = posts?.filter((post) =>
    [post.title, post.excerpt, post.author.name, post.soma.name]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );

  return (
    <main className="flex min-h-screen flex-col bg-background pb-24">
      
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-primary">Find your corner</p>
            <h1 className="font-heading text-3xl font-medium tracking-[-0.04em] sm:text-4xl">Explore at your own pace</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Follow a thread of curiosity. Every Soma is a smaller place to spend time with work that matters.</p>
          </div>
          <div className="relative mt-7 max-w-xl">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="size-5 text-muted-foreground" />
            </div>
            <Input 
              type="text" 
              placeholder="Search art, creators, or communities..." 
              className="h-11 rounded-lg border-border bg-card pl-12 text-sm shadow-none focus-visible:ring-ring/25"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10">
        
        <Tabs defaultValue="somas" className="w-full">
          <TabsList variant="pill" className="mb-10">
            <TabsTrigger value="somas">Communities</TabsTrigger>
            <TabsTrigger value="posts">Work</TabsTrigger>
            <TabsTrigger value="foryou">For You</TabsTrigger>
          </TabsList>

          {/* Somas Grid Tab */}
          <TabsContent value="somas" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="mb-7 flex flex-col gap-1">
              <h2 className="font-heading text-2xl font-medium tracking-[-0.03em]">Communities worth lingering in</h2>
              <p className="text-sm text-muted-foreground">Find people who care about the same details you do.</p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {somasLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col h-72 rounded-xl border border-border/40 bg-card overflow-hidden">
                    <Skeleton className="h-32 w-full rounded-none" />
                    <div className="p-5 relative flex-1">
                      <Skeleton className="size-16 rounded-full absolute -top-8 border-4 border-background" />
                      <Skeleton className="h-5 w-3/4 mt-8 mb-2" />
                      <Skeleton className="h-4 w-1/4 mb-4" />
                      <Skeleton className="h-3 w-full mb-1" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                ))
              ) : (
                filteredSomas?.map((soma) => (
                  <SomaGridCard key={soma.id} soma={soma} />
                ))
              )}
            </div>
          </TabsContent>

          {/* Trending Posts Tab (Masonry-like layout using columns) */}
          <TabsContent value="posts" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="max-w-3xl">
              <div className="mb-7 flex flex-col gap-1">
                <h2 className="font-heading text-2xl font-medium tracking-[-0.03em]">Work being shared now</h2>
                <p className="text-sm text-muted-foreground">A slower feed of process, practice, and finished work.</p>
              </div>
              {postsLoading ? (
                <div className="py-12 text-muted-foreground">Loading work...</div>
              ) : (
                filteredPosts?.map((post) => <PostCard key={post.id} post={post} />)
              )}
            </div>
          </TabsContent>

          {/* For You Tab */}
          <TabsContent value="foryou" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
             <div className="flex max-w-xl flex-col items-start border-y border-border py-16 text-left">
              <div className="mb-5 flex size-11 items-center justify-center rounded-full bg-accent">
                <Sparkles className="size-5 text-primary" />
              </div>
              <h3 className="font-heading text-2xl font-medium tracking-[-0.03em]">Curated for your taste</h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                Interact with more art and communities to help us tailor this feed to your exact preferences.
              </p>
            </div>
          </TabsContent>

        </Tabs>
      </section>
    </main>
  );
}
