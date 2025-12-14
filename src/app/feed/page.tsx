/** @format */

"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { components } from "@/lib/api-types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ThumbsUp, Trophy } from "lucide-react"; // Import some basic icons if available or standard ones

type FeedItem = components["schemas"]["FeedItem"];

export default function FeedPage() {
  const [posts, setPosts] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFeed() {
      try {
        const data = await api.getFeed();
        setPosts(data);
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
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-2xl p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Your Feed</h1>

      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="text-sm text-muted-foreground mb-1">
                <span className="font-semibold text-primary">
                  {post.soma.name}
                </span>
                <span className="mx-2">•</span>
                <span>Posted by @{post.author.username}</span>
              </div>
            </div>
            <CardTitle className="text-xl">{post.title}</CardTitle>
          </CardHeader>

          <CardContent>
            {post.media && post.media.items.length > 0 && (
              <div className="mb-4 rounded-md overflow-hidden bg-muted">
                {/* Simple preview logic: show first item if it's an image or video */}
                {post.media.items[0].type === "IMAGE" && (
                  <img
                    src={post.media.items[0].originalUrl}
                    alt="Post content"
                    className="w-full h-auto object-cover max-h-96"
                  />
                )}
                {post.media.items[0].type === "VIDEO" && (
                  <video
                    src={post.media.items[0].originalUrl}
                    controls
                    className="w-full h-auto max-h-96"
                  />
                )}
              </div>
            )}

            {/* We could render body preview here if needed, but requirements just said title/author/soma/media/counts */}
          </CardContent>

          <CardFooter className="flex gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              <span>{post.voteCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>{post.awardCount}</span>
            </div>
          </CardFooter>
        </Card>
      ))}

      {posts.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          No posts found. Join some Somas to see content!
        </div>
      )}
    </div>
  );
}
