/** @format */

import HeaderBlock from "@/components/header-block";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeaderBlock />
      {children}
    </>
  );
}
