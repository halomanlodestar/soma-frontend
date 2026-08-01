import type { Metadata } from "next";
import { InformationLinks, InformationPage } from "@/components/common/InformationPage";

export const metadata: Metadata = {
  title: "Community Guidelines",
  description: "The shared expectations that keep Soma generous, original, and human.",
};

export default function GuidelinesPage() {
  return (
    <InformationPage
      eyebrow="Shared expectations"
      title="How we keep the room good."
      intro="Soma is a community of people making and caring about work. These expectations protect the kind of attention that makes that possible."
      sections={[
        {
          title: "Share work with context",
          body: <p>Tell people enough to meet the work well: its story, process, credits, and anything they should know before responding.</p>,
        },
        {
          title: "Credit travels with the work",
          body: <p>Only share work you made or have permission to share. Credit collaborators, references, and source material plainly. Do not pass another person’s work off as your own.</p>,
        },
        {
          title: "Be clear about assistance",
          body: <p>Soma values human intention and craft. If a tool, system, or collaborator materially shaped a piece, disclose that context honestly instead of asking others to guess.</p>,
        },
        {
          title: "Critique should help the work grow",
          body: <p>Speak to the work with specificity and generosity. Disagreement is welcome; contempt, pile-ons, harassment, and personal attacks are not.</p>,
        },
        {
          title: "Respect consent and safety",
          body: <p>Do not share personal information, intimate material, or images of people without their permission. Use content warnings where they help people choose how and when to engage.</p>,
        },
        {
          title: "Help us protect the space",
          body: <p>Report work or behavior that seems unsafe, copied, misleading, or out of place. Moderators may ask for context, limit visibility, or remove work to protect the community.</p>,
        },
      ]}
      aside={<InformationLinks links={[{ href: "/content-policy", label: "Content policy" }, { href: "/support", label: "Get support" }, { href: "/contact", label: "Contact Soma" }]} />}
    />
  );
}
