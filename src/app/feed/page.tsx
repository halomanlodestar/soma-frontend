/** @format */

"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { FeedItem as FeedItemType, Soma } from "@/lib/types";
import { FeedItem } from "@/components/feed/FeedItem";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function FeedPage() {
  const [posts, setPosts] = useState<FeedItemType[]>([]);
  const [somas, setSomas] = useState<Soma[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFeed() {
      try {
        const [feedData, somasData] = await Promise.all([
          api.getFeed(),
          api.getAllSomas(),
        ]);
        setPosts(feedData);
        setSomas(somasData.slice(0, 5)); // Take top 5 for sidebar
      } catch (err: unknown) {
        console.error("Failed to load feed", err);
        setError("Failed to load feed. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadFeed();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-destructive/10 text-destructive rounded-lg mx-auto max-w-lg mt-8">
        {error}
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

          <div className="flex flex-col divide-y divide-border">
            {posts.length > 0 ? (
              posts.map((post) => (
                <FeedItem key={post.id} post={post} className="px-0" />
              ))
            ) : (
              <div className="p-12 text-center text-muted-foreground bg-muted/30 rounded-lg">
                <p>No posts found. Join some Somas to see content!</p>
              </div>
            )}
          </div>
        </main>

        {/* Context Column (Secondary) - Width ~1/3 (4 cols) */}
        <aside className="hidden lg:block lg:col-span-4 space-y-4 sticky top-20 h-fit">
          {/* Popular Somas - Denser */}
          <div className="border rounded-2xl bg-card shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b bg-muted/20">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Your Communities
              </h3>
            </div>
            <div className="p-3">
              <div className="space-y-1">
                {somas.map((soma) => (
                  <div
                    key={soma.id}
                    className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-sm bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] uppercase">
                        {soma.slug.substring(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <Link
                          href={`/somas/${soma.slug}`}
                          className="text-sm font-medium hover:underline leading-none mb-0.5"
                        >
                          s/{soma.name}
                        </Link>
                        <span className="text-[10px] text-muted-foreground">
                          12k members
                        </span>
                      </div>
                    </div>
                    {/* Join button hidden by default, shown on hover/focus could be a nice touch, but keeping simple for now */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {somas.length === 0 && (
                  <div className="text-sm text-muted-foreground p-2">
                    No communities found.
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                className="w-full mt-2 h-8 text-xs text-muted-foreground hover:text-primary"
              >
                View All
              </Button>
            </div>
          </div>

          {/* Following (Mock) - Denser */}
          <div className="border rounded-2xl bg-card shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b bg-muted/20">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Following
              </h3>
            </div>
            <div className="p-3">
              <div className="space-y-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded-md transition-colors cursor-pointer"
                  >
                    <div className="relative">
                      <div className="h-8 w-8 rounded-full bg-slate-200" />
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium leading-none">
                        User_{i}
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">
                        Online
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground px-2">
            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-2">
              <Link href="#" className="hover:underline">
                About
              </Link>
              <Link href="#" className="hover:underline">
                Careers
              </Link>
              <Link href="#" className="hover:underline">
                Press
              </Link>
              <Link href="#" className="hover:underline">
                Terms
              </Link>
              <Link href="#" className="hover:underline">
                Privacy
              </Link>
            </div>
            Soma © 2025. All rights reserved.
          </div>
        </aside>
      </div>
    </div>
  );
}
