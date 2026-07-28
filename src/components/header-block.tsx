/** @format */

"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Menu, Plus } from "lucide-react";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetMe } from "@/modules/user/api/useGetMe";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
];

export default function HeaderBlock() {
  const [open, setOpen] = useState(false);
  const { me, isLoading } = useGetMe();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/92 backdrop-blur-md">
      <div className="mx-auto flex h-17 w-full max-w-7xl items-center gap-8 px-4 sm:px-6">
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
          <span className="font-heading text-xl font-bold tracking-[-0.06em]">
            soma
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Button asChild>
            <Link href="/create">
              Create Post
              <Plus />
            </Link>
          </Button>
          {isLoading ? (
            <div className="size-8 rounded-full bg-muted animate-pulse" />
          ) : me ? (
            <Link href={`/u/${me.username}`} className="ml-2">
              <Avatar className="size-8">
                <AvatarImage
                  src={me.avatarUrl || undefined}
                  alt={me.displayName || me.username}
                />
                <AvatarFallback>
                  {(me.displayName || me.username).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 rounded-full px-4 text-sm font-semibold text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href="/login">Log in</Link>
            </Button>
          )}
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
                soma
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
                  <a href="/login">Log in</a>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button className="w-full" asChild>
                  <a href="/create">
                    Create post
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
