/** @format */

"use client";

import { useState } from "react";
import { Search, Hash, Flame, Sparkles } from "lucide-react";

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

  return (
    <main className="flex min-h-screen flex-col bg-background pb-24">
      
      {/* Search Header (Instagram/Reddit inspired unified search) */}
      <div className="w-full border-b border-border bg-background/92 sticky top-17 z-20 backdrop-blur-md">
        <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div><p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-primary">Find your corner</p><h1 className="font-heading text-3xl font-medium tracking-[-0.05em] sm:text-4xl">Explore at your own pace</h1></div>
          </div>
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="size-5 text-muted-foreground" />
            </div>
            <Input 
              type="text" 
              placeholder="Search art, creators, or communities..." 
              className="h-12 rounded-xl border-border bg-card pl-12 text-base shadow-none focus-visible:ring-ring/25"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 mt-10">
        
        <Tabs defaultValue="somas" className="w-full">
          <TabsList className="mb-8 h-auto w-full justify-start gap-7 rounded-none border-b border-border bg-transparent p-0">
            <TabsTrigger 
              value="somas" 
              className="rounded-none border-b-2 border-transparent px-0 py-3 text-sm font-medium data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Hash className="size-4" />
              Discover Somas
            </TabsTrigger>
            <TabsTrigger 
              value="posts" 
              className="rounded-none border-b-2 border-transparent px-0 py-3 text-sm font-medium data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Flame className="size-4" />
              Trending Art
            </TabsTrigger>
            <TabsTrigger 
              value="foryou" 
              className="rounded-none border-b-2 border-transparent px-0 py-3 text-sm font-medium data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Sparkles className="size-4" />
              For You
            </TabsTrigger>
          </TabsList>

          {/* Somas Grid Tab */}
          <TabsContent value="somas" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
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
                somas?.map((soma) => (
                  <SomaGridCard key={soma.id} soma={soma} />
                ))
              )}
            </div>
          </TabsContent>

          {/* Trending Posts Tab (Masonry-like layout using columns) */}
          <TabsContent value="posts" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {postsLoading ? (
                <div className="col-span-1 md:col-span-2 text-center py-12 text-muted-foreground">Loading trending posts...</div>
              ) : (
                posts?.map((post) => (
                  <div key={post.id} className="break-inside-avoid">
                    <PostCard post={post} />
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* For You Tab */}
          <TabsContent value="foryou" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
             <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="size-16 rounded-full bg-accent flex items-center justify-center mb-4">
                <Sparkles className="size-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold tracking-tight">Curated for your taste</h3>
              <p className="text-muted-foreground mt-2 max-w-sm">
                Interact with more art and communities to help us tailor this feed to your exact preferences.
              </p>
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </main>
  );
}
