import { InformationLinks, InformationPage } from "@/components/common/InformationPage";

export const metadata = { title: "Cookies", description: "How Soma uses cookies and similar browser storage." };

export default function CookiesPage() {
  return <InformationPage eyebrow="Cookies" title="Cookies and similar storage" intro="Soma uses essential browser storage to keep the service secure, maintain sessions, and remember basic preferences. We do not use cookies to sell advertising profiles." sections={[
    { title: "Essential cookies", body: <p>Session and security cookies help keep you signed in, protect against misuse, and make account-related features work. Disabling them can prevent parts of Soma from functioning.</p> },
    { title: "Preferences", body: <p>We may store choices such as your theme preference to make the site more comfortable to use. These settings are not used to track you across unrelated services.</p> },
    { title: "Managing cookies", body: <p>You can manage or remove cookies in your browser settings. Removing essential cookies may sign you out or reset your preferences.</p> },
  ]} aside={<InformationLinks links={[{ href: "/privacy", label: "Privacy" }, { href: "/terms", label: "Terms" }, { href: "/contact", label: "Cookie questions" }]} />} />;
}
