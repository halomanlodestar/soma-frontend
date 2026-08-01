import type { Metadata } from "next";
import Link from "next/link";
import { InformationLinks, InformationPage } from "@/components/common/InformationPage";

export const metadata: Metadata = {
  title: "Contact",
  description: "How to reach the Soma team about the platform, safety, and rights questions.",
};

export default function ContactPage() {
  return (
    <InformationPage
      eyebrow="Contact"
      title="A real person should be able to help."
      intro="Choose the route that best fits your question so it reaches the right part of Soma."
      sections={[
        {
          title: "General questions",
          body: <p>For questions about Soma, creator applications, and feedback on the product, write to <Link className="text-primary underline-offset-4 hover:underline" href="mailto:hello@soma.art">hello@soma.art</Link>.</p>,
        },
        {
          title: "Safety and moderation",
          body: <p>If something on Soma feels unsafe or breaks our policies, use the report option on the work or profile when it is available. For urgent matters that cannot wait, contact us with the relevant link and a short description.</p>,
        },
        {
          title: "Rights and copyright",
          body: <p>For a rights concern, include the relevant Soma URL, the original source if available, and enough information for us to understand your relationship to the work. Please do not share sensitive personal information in public comments.</p>,
        },
      ]}
      aside={<InformationLinks links={[{ href: "/support", label: "Visit support" }, { href: "/content-policy", label: "Content policy" }, { href: "/accessibility", label: "Accessibility" }]} />}
    />
  );
}
