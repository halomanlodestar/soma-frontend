import type { Metadata } from "next";
import { createPageMetadata, privatePageMetadata, stringifyJsonLd } from "@/lib/metadata";
import { getPublicSomaSeo } from "@/lib/public-seo";

type SomaLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ somaSlug: string }>;
}>;

export async function generateMetadata({ params }: SomaLayoutProps): Promise<Metadata> {
  const { somaSlug } = await params;
  const soma = await getPublicSomaSeo(somaSlug);

  if (!soma) {
    return {
      ...createPageMetadata({
        title: "Community",
        description: "A community on Soma.",
        path: `/s/${encodeURIComponent(somaSlug)}`,
      }),
      ...privatePageMetadata,
    };
  }

  return createPageMetadata({
    title: `${soma.name} — s/${soma.slug}`,
    description: soma.description || `Explore ${soma.name}, a community on Soma.`,
    path: `/s/${encodeURIComponent(soma.slug)}`,
    imageUrl: soma.coverUrl,
    imageAlt: soma.coverUrl ? `${soma.name} community cover` : undefined,
  });
}

export default async function SomaLayout({ children, params }: SomaLayoutProps) {
  const { somaSlug } = await params;
  const soma = await getPublicSomaSeo(somaSlug);

  const structuredData = soma
    ? {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: soma.name,
        description: soma.description || undefined,
        url: `/s/${encodeURIComponent(soma.slug)}`,
        image: soma.coverUrl || undefined,
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
