import type { Metadata } from "next";
import { absoluteUrl, createPageMetadata, privatePageMetadata, stringifyJsonLd } from "@/lib/metadata";
import { getPublicPostSeo } from "@/lib/public-seo";

type PostLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ somaSlug: string; postId: string }>;
}>;

export async function generateMetadata({ params }: PostLayoutProps): Promise<Metadata> {
  const { somaSlug, postId } = await params;
  const post = await getPublicPostSeo(postId);
  const path = `/s/${encodeURIComponent(somaSlug)}/posts/${encodeURIComponent(postId)}`;

  if (!post) {
    return {
      ...createPageMetadata({
        title: "Work",
        description: "A work shared on Soma.",
        path,
      }),
      ...privatePageMetadata,
    };
  }

  return createPageMetadata({
    title: post.title,
    description: post.excerpt || `A work by ${post.author.displayName || post.author.username} on Soma.`,
    path: `/s/${encodeURIComponent(post.soma.slug)}/posts/${encodeURIComponent(post.id)}`,
    imageUrl: post.mediaUrl,
    imageAlt: post.mediaUrl ? post.title : undefined,
  });
}

export default async function PostLayout({ children, params }: PostLayoutProps) {
  const { postId } = await params;
  const post = await getPublicPostSeo(postId);

  const structuredData = post
    ? {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: post.title,
        description: post.excerpt || post.body || undefined,
        url: absoluteUrl(`/s/${encodeURIComponent(post.soma.slug)}/posts/${encodeURIComponent(post.id)}`),
        image: post.mediaUrl || undefined,
        dateCreated: post.createdAt,
        author: {
          "@type": "Person",
          name: post.author.displayName || post.author.username,
          url: absoluteUrl(`/u/${encodeURIComponent(post.author.username)}`),
        },
        isPartOf: {
          "@type": "CollectionPage",
          name: post.soma.name,
          url: absoluteUrl(`/s/${encodeURIComponent(post.soma.slug)}`),
        },
      }
    : null;

  return (
    <>
      {structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: stringifyJsonLd(structuredData) }}
        />
      ) : null}
      {children}
    </>
  );
}
