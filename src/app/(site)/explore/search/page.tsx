/** @format */

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";

import { graphql } from "@/gql";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SearchPageDocument = graphql(`
  query SearchPage($input: SearchInput!) {
    search(input: $input) {
      totalCount
      nodes {
        id
        kind
        title
        subtitle
        slug
        imageUrl
      }
    }
  }
`);

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("query") ?? "").trim();
  const hasQuery = query.length >= 2;
  const { data, loading, error } = useQuery(SearchPageDocument, { variables: { input: { query, first: 20 } }, skip: !hasQuery, fetchPolicy: "cache-and-network" });
  const creators = data?.search.nodes.filter((result) => result.kind === "CREATOR") ?? [];
  const somas = data?.search.nodes.filter((result) => result.kind === "SOMA") ?? [];
  const posts = data?.search.nodes.filter((result) => result.kind === "POST") ?? [];

  if (!hasQuery) return <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center px-4 sm:px-6"><p className="border-y border-border py-10 text-sm leading-6 text-muted-foreground">Enter at least two characters on <Link href="/explore" className="text-primary underline underline-offset-4">Explore</Link> to search Soma.</p></main>;

  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="border-b border-border"><div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14"><p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">Search results</p><h1 className="mt-3 font-heading text-3xl font-medium tracking-[-0.04em] sm:text-4xl">Results for “{query}”</h1><Link href="/explore" className="mt-4 inline-block text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">Back to Explore</Link></div></header>
      <section className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10"><Tabs defaultValue="creators" className="w-full"><TabsList variant="pill" className="mb-10"><TabsTrigger value="creators">Creators</TabsTrigger><TabsTrigger value="somas">Communities</TabsTrigger><TabsTrigger value="posts">Work</TabsTrigger></TabsList>
        <TabsContent value="creators" className="mt-0 max-w-3xl"><ResultList loading={loading} error={error} empty="No creators matched this search." results={creators} kind="CREATOR" /></TabsContent>
        <TabsContent value="somas" className="mt-0 max-w-3xl"><ResultList loading={loading} error={error} empty="No communities matched this search." results={somas} kind="SOMA" /></TabsContent>
        <TabsContent value="posts" className="mt-0 max-w-3xl"><ResultList loading={loading} error={error} empty="No work matched this search. Try a title, material, practice, or community name." results={posts} kind="POST" /></TabsContent>
      </Tabs></section>
    </main>
  );
}

function ResultList({ loading, error, empty, results, kind }: { loading: boolean; error: unknown; empty: string; results: Array<{ id: string; title: string; subtitle: string | null; slug: string | null }>; kind: "CREATOR" | "SOMA" | "POST" }) {
  if (error) return <Status text="Search is unavailable right now. Please try again in a moment." />;
  if (loading) return <WorkSkeleton />;
  if (results.length === 0) return <Status text={empty} />;
  return <div className="divide-y divide-border">{results.map((result) => <Link key={result.id} href={kind === "CREATOR" ? `/u/${result.slug ?? result.id}` : kind === "SOMA" ? `/s/${result.slug ?? result.id}` : result.slug ? `/s/${result.slug}/posts/${result.id}` : "/explore"} className="block py-5 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><p className="text-base font-medium text-foreground">{result.title}</p>{result.subtitle && <p className="mt-1 text-sm text-muted-foreground">{result.subtitle}</p>}</Link>)}</div>;
}

function Status({ text }: { text: string }) { return <p className="border-y border-border py-10 text-sm leading-6 text-muted-foreground">{text}</p>; }
function WorkSkeleton() { return <div className="space-y-8"><Skeleton className="h-32 w-full" /><Skeleton className="h-32 w-full" /></div>; }
