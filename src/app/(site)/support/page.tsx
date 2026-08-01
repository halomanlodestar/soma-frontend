import type { Metadata } from "next";
import Link from "next/link";
import { InformationLinks, InformationPage } from "@/components/common/InformationPage";

export const metadata: Metadata = {
  title: "Support",
  description: "Help with using Soma, sharing work, and keeping the community safe.",
};

export default function SupportPage() {
  return (
    <InformationPage
      eyebrow="Support"
      title="A little help, without the runaround."
      intro="Start here for common questions about Soma. If the answer is not here, we will point you toward the right person."
      sections={[
        {
          title: "Using Soma",
          body: <p>Anyone can explore published work. Creators are welcomed through a review process before they can share work. Community membership and creator tools will become available as the platform grows.</p>,
        },
        {
          title: "Sharing work",
          body: <p>Before posting, make sure you can explain the work, credit collaborators, and share any context that helps people meet it thoughtfully. Review the guidelines and content policy before submitting.</p>,
        },
        {
          title: "Getting help",
          body: <p>For account, access, or platform questions, contact <Link className="text-primary underline-offset-4 hover:underline" href="mailto:hello@soma.art">hello@soma.art</Link>. For a content concern, include the relevant URL and avoid posting sensitive details publicly.</p>,
        },
      ]}
      aside={<InformationLinks links={[{ href: "/how-it-works", label: "How Soma works" }, { href: "/guidelines", label: "Guidelines" }, { href: "/contact", label: "Contact Soma" }]} />}
    />
  );
}
