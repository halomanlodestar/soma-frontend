/** @format */

import Link from "next/link";

import {
  InformationLinks,
  InformationPage,
} from "@/components/common/InformationPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Report a concern",
  description:
    "How to report content or behaviour that may violate Soma’s policies.",
};

export default function ReportPage() {
  return (
    <InformationPage
      eyebrow="Safety"
      title="Report a concern"
      intro="Soma is building a direct reporting workflow. Until it is available, use the steps below to flag a concern without sharing more personal information than necessary."
      sections={[
        {
          title: "What to include",
          body: (
            <p>
              Send the page link, a short description of the concern, and any
              context that would help us understand it. You can report copied
              work, misleading attribution, harassment, safety concerns, or
              content that breaks our policies.
            </p>
          ),
        },
        {
          title: "How to contact us",
          body: (
            <p>
              Use the{" "}
              <Link
                href="/contact"
                className="text-primary underline underline-offset-4"
              >
                contact page
              </Link>{" "}
              and choose the safety or rights topic. We will use the information
              only to review the concern and reply when a response is
              appropriate.
            </p>
          ),
        },
        {
          title: "Urgent safety",
          body: (
            <p>
              If there is an immediate risk of harm, contact local emergency
              services first. Do not rely on an online report for urgent help.
            </p>
          ),
        },
      ]}
      aside={
        <InformationLinks
          links={[
            { href: "/guidelines", label: "Community guidelines" },
            { href: "/content-policy", label: "Content policy" },
            { href: "/copyright", label: "Copyright information" },
          ]}
        />
      }
    />
  );
}
