import Link from "next/link";
import { InformationLinks, InformationPage } from "@/components/common/InformationPage";

export const metadata = { title: "Terms", description: "The basic terms for using Soma." };

export default function TermsPage() {
  return <InformationPage eyebrow="Terms" title="Using Soma with care" intro="By using Soma, you agree to treat other people’s work, safety, and rights with care. These short terms describe the expectations that make that possible." sections={[
    { title: "Your account and work", body: <p>You are responsible for your account and for the accuracy of the information and work you publish. Only publish material you have the right to share, and keep attribution clear.</p> },
    { title: "Community standards", body: <p>Use Soma in line with the <Link href="/guidelines" className="text-primary underline underline-offset-4">community guidelines</Link> and <Link href="/content-policy" className="text-primary underline underline-offset-4">content policy</Link>. We may limit or remove material that creates safety, rights, or policy concerns.</p> },
    { title: "Service availability", body: <p>Soma is provided as it develops. We work to keep it reliable, but cannot promise uninterrupted access or that every feature will always be available.</p> },
  ]} aside={<InformationLinks links={[{ href: "/guidelines", label: "Community guidelines" }, { href: "/privacy", label: "Privacy" }, { href: "/contact", label: "Contact Soma" }]} />} />;
}
