/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { Compass, FileText, Search, Sparkles, UserRound } from "lucide-react";

import { graphql } from "@/gql";
import { PostCard } from "@/components/common/PostCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SomaGridCard } from "@/modules/soma/components/SomaGridCard";
import { useGetPosts } from "@/modules/post/api/useGetPosts";
import { useGetSomas } from "@/modules/soma/api/useGetSomas";

const SEARCH_DELAY_MS = 300;
const MIN_SEARCH_LENGTH = 2;

const ExploreAutocompleteDocument = graphql(`
  query ExploreAutocomplete($input: AutocompleteInput!) {
    autocomplete(input: $input) {
      id
      kind
      title
      subtitle
      slug
    }
  }
`);

export default function ExplorePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const { data: somas, isLoading: somasLoading } = useGetSomas();
  const { data: posts, isLoading: postsLoading } = useGetPosts();
  const shouldAutocomplete = debouncedQuery.length >= MIN_SEARCH_LENGTH;
  const { data: autocompleteData, loading: autocompleteLoading, error: autocompleteError } = useQuery(ExploreAutocompleteDocument, {
    variables: { input: { query: debouncedQuery, first: 8 } },
    skip: !shouldAutocomplete,
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedQuery(searchQuery.trim()), SEARCH_DELAY_MS);
    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  const groups = useMemo(() => {
    const results = autocompleteData?.autocomplete ?? [];
    return [
      { kind: "CREATOR", label: "Creators", icon: UserRound, results: results.filter((result) => result.kind === "CREATOR") },
      { kind: "SOMA", label: "Communities", icon: Compass, results: results.filter((result) => result.kind === "SOMA") },
      { kind: "POST", label: "Work", icon: FileText, results: results.filter((result) => result.kind === "POST") },
    ];
  }, [autocompleteData]);
  const hasSuggestions = groups.some((group) => group.results.length > 0);
  const searchHref = `/explore/search?query=${encodeURIComponent(searchQuery.trim())}`;

  return (
    <main className="flex min-h-screen flex-col bg-background pb-24">
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-primary">Find your corner</p>
            <h1 className="font-heading text-3xl font-medium tracking-[-0.04em] sm:text-4xl">Explore at your own pace</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Follow a thread of curiosity. Every Soma is a smaller place to spend time with work that matters.</p>
          </div>
          <div className="relative mt-7 max-w-xl" onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setSuggestionsOpen(false); }} onFocusCapture={() => setSuggestionsOpen(true)}>
            <form role="search" onSubmit={(event) => { event.preventDefault(); if (searchQuery.trim().length >= MIN_SEARCH_LENGTH) router.push(searchHref); }}>
              <label htmlFor="explore-search" className="sr-only">Search creators, communities, or work</label>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"><Search className="size-5 text-muted-foreground" aria-hidden="true" /></div>
              <Input id="explore-search" type="search" name="query" autoComplete="off" placeholder="Search art, creators, or communities..." className="h-11 rounded-lg border-border bg-card pl-12 text-sm shadow-none focus-visible:ring-ring/25" value={searchQuery} aria-expanded={suggestionsOpen && shouldAutocomplete} aria-controls="explore-suggestions" aria-autocomplete="list" onChange={(event) => { setSearchQuery(event.target.value); setSuggestionsOpen(event.target.value.trim().length > 0); }} onKeyDown={(event) => { if (event.key === "Escape") setSuggestionsOpen(false); }} />
            </form>
            {suggestionsOpen && shouldAutocomplete && (
              <div id="explore-suggestions" className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-border bg-card shadow-lg" aria-live="polite">
                {autocompleteLoading ? <p className="px-4 py-4 text-sm text-muted-foreground">Finding places and work…</p> : autocompleteError ? <p className="px-4 py-4 text-sm text-muted-foreground">Suggestions are unavailable right now.</p> : hasSuggestions ? (
                  <div className="divide-y divide-border">
                    {groups.map((group) => group.results.length > 0 && <div key={group.kind} className="py-2"><p className="px-4 py-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{group.label}</p>{group.results.map((result) => <a key={`${result.kind}-${result.id}`} href={result.kind === "CREATOR" ? `/u/${result.slug ?? result.id}` : result.kind === "SOMA" ? `/s/${result.slug ?? result.id}` : result.slug ? `/s/${result.slug}/posts/${result.id}` : searchHref} className="flex min-h-11 flex-col justify-center px-4 py-2.5 transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"><span className="text-sm font-medium text-foreground">{result.title}</span>{result.subtitle && <span className="mt-0.5 text-xs text-muted-foreground">{result.subtitle}</span>}</a>)}</div>)}
                  </div>
                ) : <p className="px-4 py-4 text-sm text-muted-foreground">No suggestions for “{debouncedQuery}”. Press Enter for all results.</p>}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10">
        <Tabs defaultValue="somas" className="w-full">
          <TabsList variant="pill" className="mb-10"><TabsTrigger value="somas">Communities</TabsTrigger><TabsTrigger value="posts">Work</TabsTrigger><TabsTrigger value="foryou">For You</TabsTrigger></TabsList>
          <TabsContent value="somas" className="mt-0 focus-visible:outline-none focus-visible:ring-0"><div className="mb-7 flex flex-col gap-1"><h2 className="font-heading text-2xl font-medium tracking-[-0.03em]">Communities worth lingering in</h2><p className="text-sm text-muted-foreground">Find people who care about the same details you do.</p></div><div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{somasLoading ? Array.from({ length: 8 }).map((_, index) => <SomaSkeleton key={index} />) : somas?.map((soma) => <SomaGridCard key={soma.id} soma={soma} />)}</div></TabsContent>
          <TabsContent value="posts" className="mt-0 focus-visible:outline-none focus-visible:ring-0"><div className="max-w-3xl"><div className="mb-7 flex flex-col gap-1"><h2 className="font-heading text-2xl font-medium tracking-[-0.03em]">Work being shared now</h2><p className="text-sm text-muted-foreground">A slower feed of process, practice, and finished work.</p></div>{postsLoading ? <WorkSkeleton /> : posts?.map((post) => <PostCard key={post.id} post={post} />)}</div></TabsContent>
          <TabsContent value="foryou" className="mt-0 focus-visible:outline-none focus-visible:ring-0"><div className="flex max-w-xl flex-col items-start border-y border-border py-16 text-left"><div className="mb-5 flex size-11 items-center justify-center rounded-full bg-accent"><Sparkles className="size-5 text-primary" aria-hidden="true" /></div><h3 className="font-heading text-2xl font-medium tracking-[-0.03em]">Curated for your taste</h3><p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">Interact with more art and communities to help us tailor this feed to your exact preferences.</p></div></TabsContent>
        </Tabs>
      </section>
    </main>
  );
}

function SomaSkeleton() { return <div className="flex h-72 flex-col overflow-hidden rounded-xl border border-border/40 bg-card"><Skeleton className="h-32 w-full rounded-none" /><div className="relative flex-1 p-5"><Skeleton className="absolute -top-8 size-16 rounded-full border-4 border-background" /><Skeleton className="mb-2 mt-8 h-5 w-3/4" /><Skeleton className="mb-4 h-4 w-1/4" /><Skeleton className="mb-1 h-3 w-full" /><Skeleton className="h-3 w-2/3" /></div></div>; }
function WorkSkeleton() { return <div className="space-y-8"><Skeleton className="h-48 w-full" /><Skeleton className="h-48 w-full" /></div>; }
