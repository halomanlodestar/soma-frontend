import { InformationLinks, InformationPage } from "@/components/common/InformationPage";

export const metadata = { title: "Copyright", description: "Soma’s copyright, DMCA, and counter-notice process." };

export default function CopyrightPage() {
  return <InformationPage eyebrow="Rights and credit" title="Copyright on Soma" intro="Creators retain ownership of their work. Soma expects clear credit, permission, and a good-faith process when someone believes their rights have been infringed." sections={[
    { title: "Share only what you can share", body: <p>Post work you created, collaborated on with clear credit, or have permission to publish. Include collaborators, source material, and licensing context where it helps people understand the work.</p> },
    { title: "Copyright concerns", body: <p>If you believe material on Soma infringes your copyright, send us the relevant page link, the work you believe has been copied, your contact information, and a statement that your report is made in good faith.</p> },
    { title: "Counter-notices", body: <p>If your work has been removed in error, contact us with the affected link and the basis for your objection. We will review counter-notices in line with applicable law and our moderation process.</p> },
  ]} aside={<InformationLinks links={[{ href: "/content-policy", label: "Content policy" }, { href: "/report", label: "Report a concern" }, { href: "/contact", label: "Contact Soma" }]} />} />;
}
