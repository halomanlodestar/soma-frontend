import { InformationLinks, InformationPage } from "@/components/common/InformationPage";

export const metadata = { title: "Privacy", description: "How Soma handles account, profile, and support information." };

export default function PrivacyPage() {
  return <InformationPage eyebrow="Privacy" title="Your information, handled with care" intro="Soma collects the information needed to operate accounts, publish work, maintain safety, and respond to support requests. We aim to collect less, not more." sections={[
    { title: "Information we use", body: <p>This includes account and session information, public profile details, work you publish, activity needed to operate the service, and messages you choose to send to support.</p> },
    { title: "Why we use it", body: <p>We use information to provide Soma, protect people and work, investigate policy concerns, improve reliability, and meet legal obligations. We do not sell personal information.</p> },
    { title: "Your choices", body: <p>You can update public profile information in Settings and contact us to ask about account information or privacy concerns. Some information may be retained where necessary for safety, fraud prevention, or legal compliance.</p> },
  ]} aside={<InformationLinks links={[{ href: "/terms", label: "Terms" }, { href: "/cookies", label: "Cookies" }, { href: "/contact", label: "Privacy contact" }]} />} />;
}
