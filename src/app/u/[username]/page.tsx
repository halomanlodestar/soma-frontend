/** @format */

"use client";

import { use } from "react";
import { useGetUserByUsername } from "@/modules/user/api/useGetUserByUsername";
import { useGetPostsByUser } from "@/modules/post/api/useGetPostsByUser";
import { useGetCommentsByUser } from "@/modules/comment/api/useGetCommentsByUser";

import { UserHeader } from "@/modules/user/components/UserHeader";
import { PostCard } from "@/components/common/PostCard";
import { CommentTree } from "@/modules/comment/components/CommentTree";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface UserPageProps {
  params: Promise<{ username: string }>;
}

export default function UserProfilePage({ params }: UserPageProps) {
  const { username } = use(params);

  const { data: user, isLoading: userLoading } = useGetUserByUsername(username);
  const { data: posts, isLoading: postsLoading } = useGetPostsByUser(user?.id);
  const { data: comments, isLoading: commentsLoading } =
    useGetCommentsByUser(user?.id);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      {/* Top Half: User Header */}
      <UserHeader user={user} isLoading={userLoading} />

      {/* Bottom Half: Tabs */}
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 mt-6">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="mb-8 w-full justify-start bg-transparent p-0 border-b border-border/40 rounded-none h-auto gap-8">
            <TabsTrigger
              value="posts"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-0 text-base font-medium"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="comments"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-0 text-base font-medium"
            >
              Comments
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-0 text-base font-medium"
            >
              Saved Art
            </TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent
            value="posts"
            className="mt-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <div className="flex flex-col gap-6">
              {postsLoading
                ? Array.from({ length: 2 }).map((_, i) => (
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
                : posts?.map((post) => <PostCard key={post.id} post={post} />)}
            </div>
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent
            value="comments"
            className="mt-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <div className="rounded-xl border border-border/40 bg-card p-6 shadow-sm">
              <CommentTree comments={comments} isLoading={commentsLoading} />
            </div>
          </TabsContent>

          {/* Saved Tab */}
          <TabsContent
            value="saved"
            className="mt-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="size-16 rounded-full bg-accent flex items-center justify-center mb-4">
                <svg
                  className="size-8 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg">No saved art</h3>
              <p className="text-muted-foreground mt-2 max-w-sm">
                Only {user?.name || "this user"} can see what they have saved.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
