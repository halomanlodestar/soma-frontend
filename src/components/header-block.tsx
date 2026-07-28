/** @format */

"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
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
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
];

export default function HeaderBlock() {
  const [open, setOpen] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const { me, isLoading } = useGetMe();

  useLayoutEffect(() => {
    const nav = navRef.current;
    const activeLink = nav?.querySelector<HTMLElement>("[data-active='true']");

    if (!nav || !activeLink) return;

    const updateIndicator = () => {
      setIndicator({
        left: activeLink.offsetLeft,
        width: activeLink.offsetWidth,
      });
    };

    updateIndicator();
    const resizeObserver = new ResizeObserver(updateIndicator);
    resizeObserver.observe(nav);

    return () => resizeObserver.disconnect();
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
          aria-label="Soma home"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="size-5 shrink-0 text-primary"
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
          <span className="font-heading text-xl font-medium tracking-[-0.04em]">
            soma
          </span>
        </Link>

        <nav
          ref={navRef}
          className="relative ml-8 hidden items-center gap-6 border-l border-border pl-8 md:flex"
          aria-label="Primary navigation"
        >
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.label}
                href={link.href}
                data-active={isActive}
                className={cn(
                  "py-2 text-sm transition-colors hover:text-foreground focus-visible:text-foreground",
                  isActive
                    ? "font-medium text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-1 left-0 h-px bg-primary transition-[transform,width] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{
              transform: `translateX(${indicator.left}px)`,
              width: indicator.width,
            }}
          />
        </nav>

        <div className="ml-auto hidden items-center gap-1.5 md:flex">
          <Button variant="outline" asChild>
            <Link href="/create">
              <Plus data-icon="inline-start" />
              Share work
            </Link>
          </Button>
          {isLoading ? (
            <div className="size-9 rounded-full bg-muted animate-pulse" />
          ) : me ? (
            <Link
              href={`/u/${me.username}`}
              className="ml-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <Avatar className="size-9">
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
              className="text-muted-foreground hover:text-foreground"
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

            <nav className="flex flex-col px-4" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <SheetClose asChild key={link.label}>
                  <a
                    href={link.href}
                    className={cn(
                      "border-b border-border py-4 text-sm transition-colors last:border-b-0 hover:text-foreground",
                      (
                        link.href === "/"
                          ? pathname === "/"
                          : pathname.startsWith(link.href)
                      )
                        ? "font-medium text-foreground"
                        : "text-muted-foreground",
                    )}
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
                    Share work
                    <ArrowRight data-icon="inline-end" aria-hidden="true" />
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
