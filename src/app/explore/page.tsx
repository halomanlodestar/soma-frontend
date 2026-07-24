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
    <div className="flex flex-col min-h-screen bg-background pb-24">
      
      {/* Search Header (Instagram/Reddit inspired unified search) */}
      <div className="w-full bg-card border-b border-border/40 sticky top-16 z-20 shadow-sm">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="size-5 text-muted-foreground" />
            </div>
            <Input 
              type="text" 
              placeholder="Search art, creators, or communities..." 
              className="pl-12 h-14 rounded-full bg-muted/50 border-transparent focus-visible:ring-primary/20 focus-visible:border-primary text-base shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 mt-8">
        
        <Tabs defaultValue="somas" className="w-full">
          <TabsList className="mb-8 w-full justify-start bg-transparent p-0 border-b border-border/40 rounded-none h-auto gap-8">
            <TabsTrigger 
              value="somas" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-0 text-base font-medium flex items-center gap-2"
            >
              <Hash className="size-4" />
              Discover Somas
            </TabsTrigger>
            <TabsTrigger 
              value="posts" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-0 text-base font-medium flex items-center gap-2"
            >
              <Flame className="size-4" />
              Trending Art
            </TabsTrigger>
            <TabsTrigger 
              value="foryou" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-0 text-base font-medium flex items-center gap-2"
            >
              <Sparkles className="size-4" />
              For You
            </TabsTrigger>
          </TabsList>

          {/* Somas Grid Tab */}
          <TabsContent value="somas" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    </div>
  );
}
