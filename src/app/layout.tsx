/** @format */

import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/components/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const lora = Lora({
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
    <html lang="en" className={cn("font-sans", inter.variable, lora.variable)} suppressHydrationWarning>
      <body className="antialiased font-sans bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
