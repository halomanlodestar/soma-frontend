import type { Metadata } from "next";
import { absoluteUrl, createPageMetadata, privatePageMetadata, stringifyJsonLd } from "@/lib/metadata";
import { getPublicProfileSeo } from "@/lib/public-seo";

type ProfileLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}>;

export async function generateMetadata({ params }: ProfileLayoutProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await getPublicProfileSeo(username);

  if (!profile) {
    return {
      ...createPageMetadata({
        title: "Creator",
        description: "A creator profile on Soma.",
        path: `/u/${encodeURIComponent(username)}`,
      }),
      ...privatePageMetadata,
    };
  }

  const name = profile.displayName || profile.username;
  return createPageMetadata({
    title: `${name} — @${profile.username}`,
    description: profile.bio || `Explore ${name}'s work on Soma.`,
    path: `/u/${encodeURIComponent(profile.username)}`,
    imageUrl: profile.coverUrl || profile.avatarUrl,
    imageAlt: `${name}'s Soma profile`,
  });
}

export default async function ProfileLayout({ children, params }: ProfileLayoutProps) {
  const { username } = await params;
  const profile = await getPublicProfileSeo(username);

  const structuredData = profile
    ? {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        mainEntity: {
          "@type": "Person",
          name: profile.displayName || profile.username,
          alternateName: profile.username,
          description: profile.bio || undefined,
          image: profile.avatarUrl || undefined,
          url: absoluteUrl(`/u/${encodeURIComponent(profile.username)}`),
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
