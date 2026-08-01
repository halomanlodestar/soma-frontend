/** @format */

import HeaderBlock from "@/components/header-block";
import { SiteFooter } from "@/components/site-footer";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeaderBlock />
      {children}
      <SiteFooter />
    </>
  );
}
