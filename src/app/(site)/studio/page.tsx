"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { formatDistanceToNow } from "date-fns";
import { FilePenLine, Plus, Sparkles } from "lucide-react";

import { graphql } from "@/gql";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetMe } from "@/modules/user/api/useGetMe";

const MyStudioPostsDocument = graphql(`
  query MyStudioPosts {
    myStudioPosts {
      id
      title
      body
      excerpt
      mediaUrl
      mediaStatus
      visibility
      createdAt
      updatedAt
      soma {
        name
        slug
      }
    }
  }
`);

const studioTabs = [
  { value: "all", label: "All work" },
  { value: "DRAFT", label: "Drafts" },
  { value: "SUBMITTED", label: "In review" },
  { value: "NEEDS_CHANGES", label: "Needs changes" },
  { value: "PUBLISHED", label: "Published" },
] as const;

function statusLabel(status: string) {
  return status.toLowerCase().replaceAll("_", " ");
}

export default function StudioPage() {
  const { me, isLoading: meLoading } = useGetMe();
  const { data, loading, error } = useQuery(MyStudioPostsDocument, {
    skip: !me,
  });
  const posts = useMemo(() => data?.myStudioPosts ?? [], [data]);

  if (meLoading) {
    return <StudioSkeleton />;
  }

  if (!me) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Sign in to visit your Studio</CardTitle>
            <CardDescription>
              Drafts, review status, and your published work live here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/login">Log in</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">Your practice</p>
            <h1 className="mt-3 font-heading text-4xl font-medium tracking-[-0.04em] sm:text-5xl">Studio</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Keep track of the work you are shaping and where it is in the review process.
            </p>
          </div>
          <Button asChild>
            <Link href="/create">
              <Plus data-icon="inline-start" />
              Share work
            </Link>
          </Button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {error ? (
          <Card>
            <CardHeader>
              <CardTitle>Studio is unavailable</CardTitle>
              <CardDescription>Refresh and try again in a moment.</CardDescription>
            </CardHeader>
          </Card>
        ) : loading ? (
          <StudioSkeleton />
        ) : (
          <Tabs defaultValue="all">
            <TabsList variant="pill" className="mb-8 max-w-full overflow-x-auto">
              {studioTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
              ))}
            </TabsList>
            {studioTabs.map((tab) => {
              const visiblePosts = tab.value === "all" ? posts : posts.filter((post) => post.visibility === tab.value);

              return (
                <TabsContent key={tab.value} value={tab.value} className="mt-0">
                  {visiblePosts.length === 0 ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles data-icon="inline-start" />
                          Nothing here yet
                        </CardTitle>
                        <CardDescription>
                          {tab.value === "all" ? "Your next piece can begin with a single image and a few words." : `No work is ${statusLabel(tab.value)} right now.`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button asChild variant="outline">
                          <Link href="/create">Start a post</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {visiblePosts.map((post) => (
                        <Card key={post.id} className="overflow-hidden">
                          {post.mediaUrl && (
                            <div className="relative aspect-4/3 bg-muted">
                              <Image src={post.mediaUrl} alt="" fill className="object-cover" />
                            </div>
                          )}
                          <CardHeader>
                            <Badge variant="secondary" className="w-fit capitalize">{statusLabel(post.visibility)}</Badge>
                            <CardTitle className="line-clamp-2 text-lg">{post.title}</CardTitle>
                            <CardDescription>
                              s/{post.soma.slug} · updated {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/s/${post.soma.slug}/posts/${post.id}`}>
                                <FilePenLine data-icon="inline-start" />
                                View work
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </div>
    </main>
  );
}

function StudioSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="h-12 w-52" />
      <Skeleton className="h-10 w-96" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="aspect-4/5 w-full" />)}
      </div>
    </div>
  );
}
