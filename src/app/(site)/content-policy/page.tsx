import type { Metadata } from "next";
import { InformationLinks, InformationPage } from "@/components/common/InformationPage";

export const metadata: Metadata = {
  title: "Content Policy",
  description: "What may be shared on Soma and how moderation protects human-made work.",
};

export default function ContentPolicyPage() {
  return (
    <InformationPage
      eyebrow="Care, credit, and human intention"
      title="A clear standard for what belongs here."
      intro="Soma exists for considered work and constructive conversation. This policy explains the baseline; individual communities may set more specific expectations."
      sections={[
        {
          title: "Originality and permission",
          body: <p>Share work you created, collaborated on with clear credit, or are authorised to publish. Impersonation, plagiarism, uncredited reposting, and deceptive attribution do not belong here.</p>,
        },
        {
          title: "Human-first disclosure",
          body: <p>Do not misrepresent how work was made. If generative or automated tools materially shaped a piece, disclose that context. Soma may request process context when a moderator needs it to assess a submission or report.</p>,
        },
        {
          title: "Harmful behavior and content",
          body: <p>We do not allow harassment, hate, threats, exploitation, non-consensual intimate material, doxxing, scams, or content that puts people at risk. Content involving minors is subject to heightened protection and may be removed or reported where required.</p>,
        },
        {
          title: "Sensitive material",
          body: <p>Some work may need a content warning or limited visibility. When in doubt, add context so people can make an informed choice before opening it.</p>,
        },
        {
          title: "Moderation",
          body: <p>Moderators may request clarification, limit a post, remove it, or act on an account when this policy or a community’s rules are not met. We aim to explain meaningful decisions and provide an appeal path as those systems come online.</p>,
        },
      ]}
      aside={<InformationLinks links={[{ href: "/guidelines", label: "Community guidelines" }, { href: "/copyright", label: "Copyright information" }, { href: "/support", label: "Get support" }]} />}
    />
  );
}
