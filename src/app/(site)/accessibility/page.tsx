import type { Metadata } from "next";
import { InformationLinks, InformationPage } from "@/components/common/InformationPage";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Soma’s commitment to an accessible, considered experience for everyone.",
};

export default function AccessibilityPage() {
  return (
    <InformationPage
      eyebrow="Accessibility"
      title="Art deserves an open door."
      intro="We are working to make Soma usable with different devices, assistive technologies, preferences, and ways of moving through the web."
      sections={[
        {
          title: "Our approach",
          body: <p>We design for readable type, visible focus, keyboard navigation, meaningful semantic structure, sufficient contrast, and reduced motion preferences. We also treat image descriptions and captions as part of the work—not an afterthought.</p>,
        },
        {
          title: "What we are improving",
          body: <p>Soma is evolving. We are actively improving form feedback, non-visual labels, resilient loading and error states, mobile interaction, and support for long or complex user-created content.</p>,
        },
        {
          title: "Tell us what got in the way",
          body: <p>If something makes Soma hard to use, please include the page, device, browser, and assistive technology if you are comfortable sharing them. That context helps us fix the right problem.</p>,
        },
      ]}
      aside={<InformationLinks links={[{ href: "/contact", label: "Contact Soma" }, { href: "/support", label: "Support" }, { href: "/guidelines", label: "Community guidelines" }]} />}
    />
  );
}
