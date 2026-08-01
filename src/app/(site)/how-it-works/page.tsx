import { InformationLinks, InformationPage } from "@/components/common/InformationPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "How Soma Works",
  description: "Why Soma is curated, human-first, and built for work worth lingering with.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <InformationPage
      eyebrow="A little more room for art"
      title="A social home made for lingering."
      intro="Soma is a quieter place to share work made with care—and to spend time with the people behind it."
      sections={[
        {
          title: "The work comes first",
          body: (
            <>
              <p>
                Soma is built for work, process, and the conversation that helps
                both grow. We make room for the context behind a piece instead
                of rewarding whatever can be made and posted fastest.
              </p>
              <p>
                You can browse openly, follow makers you care about, and return
                to work that stays with you.
              </p>
            </>
          ),
        },
        {
          title: "Creatorship is earned",
          body: (
            <>
              <p>
                Posting is reserved for creators who have been welcomed into the
                community. This keeps the platform focused on people sharing a
                practice—not volume, automation, or attention tricks.
              </p>
              <p>
                Our review is intended to be thoughtful and explainable. It is
                not a measure of fame, follower count, or a single aesthetic.
              </p>
            </>
          ),
        },
        {
          title: "Communities are smaller rooms",
          body: (
            <>
              <p>
                Every Soma is a focused community with its own people, shared
                expectations, and moderators. They help work find the context
                and critique it deserves.
              </p>
              <p>
                Communities are not leaderboards. They are places to return to,
                learn from, and contribute to with care.
              </p>
            </>
          ),
        },
      ]}
      aside={
        <InformationLinks
          links={[
            { href: "/guidelines", label: "Read the guidelines" },
            { href: "/content-policy", label: "Read the content policy" },
            { href: "/explore", label: "Explore Soma" },
          ]}
        />
      }
    />
  );
}
