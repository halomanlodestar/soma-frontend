/** @format */

"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
];

export default function HeaderBlock() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="size-6 shrink-0 text-primary"
          >
            <rect x="3" y="3" width="8" height="8" transform="rotate(-6 7 7)" />
            <rect
              x="3"
              y="13"
              width="8"
              height="8"
              transform="rotate(5 7 17)"
            />
            <rect
              x="13"
              y="13"
              width="8"
              height="8"
              transform="rotate(-4 17 17)"
            />
            <rect
              x="13"
              y="3"
              width="8"
              height="8"
              transform="rotate(15 17 7)"
            />
          </svg>
          <span className="text-base font-bold tracking-tight">Acme</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground font-semibold"
            asChild
          >
            <Link href="/login">Log in</Link>
          </Button>
          <Button size="sm" className="font-semibold px-5 rounded-full" asChild>
            <Link href="/create">
              Create Post
            </Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="Open menu"
              className="ml-auto md:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-3/4 max-w-xs">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2.5">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="size-5 shrink-0 text-primary"
                >
                  <rect
                    x="3"
                    y="3"
                    width="8"
                    height="8"
                    transform="rotate(-6 7 7)"
                  />
                  <rect
                    x="3"
                    y="13"
                    width="8"
                    height="8"
                    transform="rotate(5 7 17)"
                  />
                  <rect
                    x="13"
                    y="13"
                    width="8"
                    height="8"
                    transform="rotate(-4 17 17)"
                  />
                  <rect
                    x="13"
                    y="3"
                    width="8"
                    height="8"
                    transform="rotate(15 17 7)"
                  />
                </svg>
                Acme
              </SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col px-4">
              {navLinks.map((link) => (
                <SheetClose asChild key={link.label}>
                  <a
                    href={link.href}
                    className="border-b border-border py-3 text-sm font-medium text-muted-foreground transition-colors last:border-b-0 hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </SheetClose>
              ))}
            </nav>

            <SheetFooter className="mt-6 flex-col gap-2 sm:flex-col">
              <SheetClose asChild>
                <Button variant="outline" className="w-full" asChild>
                  <a href="#">Sign in</a>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button className="w-full" asChild>
                  <a href="#">
                    Get Started
                    <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                  </a>
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
