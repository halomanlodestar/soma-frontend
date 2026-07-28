/** @format */

import type { Metadata } from "next";
import { Archivo, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/components/providers";
import HeaderBlock from "@/components/header-block";

const archivo = Archivo({ subsets: ["latin"], variable: "--font-sans" });

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});
export const metadata: Metadata = {
  title: "Soma — Human creativity, in company",
  description: "A home for work made by people.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", archivo.variable, spaceGrotesk.variable)} suppressHydrationWarning>
      <body className="antialiased font-sans bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
        <Providers>
          <HeaderBlock />
          {children}
        </Providers>
      </body>
    </html>
  );
}
