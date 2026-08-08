/** @format */

"use client";

import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, Menu, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetMe } from "@/modules/user/api/useGetMe";
import { cn } from "@/lib/utils";
import { useAuthPrompt } from "@/components/providers/AuthPromptProvider";
import { ShareWorkButton } from "@/modules/post/drafts/ShareWorkButton";

const navLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Explore",
    href: "/explore",
  },
];

export default function HeaderBlock() {
  const [open, setOpen] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const [mobileHoverKey, setMobileHoverKey] = useState<string | null>(null);
  const [mobileIndicator, setMobileIndicator] = useState({ top: 0, height: 0 });
  const navRef = useRef<HTMLElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const { me, isLoading } = useGetMe();
  const { requestAuth } = useAuthPrompt();
  const mobileSelectedKey =
    navLinks.find((link) =>
      link.href === "/" ? pathname === "/" : pathname.startsWith(link.href),
  )?.href ?? ((pathname.startsWith("/u/") || pathname.startsWith("/settings")) ? "account" : null);
  const mobileHighlightKey = mobileHoverKey ?? mobileSelectedKey;

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

  const updateMobileIndicator = useCallback((target?: HTMLElement | null) => {
    const nav = mobileNavRef.current;
    const highlightedLink =
      target ??
      nav?.querySelector<HTMLElement>("[data-mobile-highlight='true']");

    if (!nav || !highlightedLink) return;

    setMobileIndicator({
      top: highlightedLink.offsetTop,
      height: highlightedLink.offsetHeight,
    });
  }, []);

  useLayoutEffect(() => {
    const nav = mobileNavRef.current;
    if (!nav) return;

    const resizeObserver = new ResizeObserver(() => updateMobileIndicator());
    resizeObserver.observe(nav);

    return () => resizeObserver.disconnect();
  }, [mobileHighlightKey, updateMobileIndicator]);

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
          {me ? (
            <>
              <Button size="sm" variant="ghost" asChild>
                <Link href="/studio">Studio</Link>
              </Button>
              <Button size="icon-sm" variant="ghost" asChild>
                <Link href="/notifications" aria-label="Notifications">
                  <Bell />
                </Link>
              </Button>
              <ShareWorkButton size="sm" />
            </>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => requestAuth("share")}
            >
              <Plus data-icon="inline-start" />
              Share work
            </Button>
          )}
          {isLoading ? (
            <div className="size-9 rounded-full bg-muted animate-pulse" />
          ) : me ? (
            <Link
              href="/settings"
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
          <SheetContent
            side="right"
            className="soma-mobile-sheet w-full max-w-none border-0 bg-background p-0 data-[state=closed]:duration-250 data-[state=open]:duration-350 data-[state=open]:ease-[cubic-bezier(0.22,1,0.36,1)]"
          >
            <SheetHeader
              className="px-6 pb-0 pt-6 text-left"
              data-sheet-reveal
              style={{ animationDelay: "70ms" }}
            >
              <SheetTitle className="flex items-center gap-2.5 font-heading text-2xl font-medium tracking-[-0.04em]">
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
              <SheetDescription className="sr-only">
                Main navigation and account actions
              </SheetDescription>
            </SheetHeader>

            <nav
              ref={mobileNavRef}
              className="relative mt-12 flex flex-col"
              aria-label="Mobile navigation"
              onPointerLeave={() => {
                setMobileHoverKey(null);
                requestAnimationFrame(() => updateMobileIndicator());
              }}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 z-0 bg-primary transition-[transform,height] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                style={{
                  transform: `translateY(${mobileIndicator.top}px)`,
                  height: mobileIndicator.height,
                }}
              />
              {navLinks.map((link) => {
                const isHighlighted = mobileHighlightKey === link.href;

                return (
                  <SheetClose asChild key={link.label}>
                    <Link
                      href={link.href}
                      className={cn(
                        "relative z-10 flex items-baseline gap-4 px-6 py-3 font-heading text-5xl font-medium leading-none tracking-[-0.055em] transition-colors sm:text-6xl",
                        isHighlighted
                          ? "text-primary-foreground"
                          : "text-foreground hover:text-primary focus-visible:text-primary",
                      )}
                      data-mobile-highlight={isHighlighted}
                      data-sheet-reveal
                      style={{
                        animationDelay: link.href === "/" ? "140ms" : "210ms",
                      }}
                      onPointerEnter={(event) => {
                        setMobileHoverKey(link.href);
                        updateMobileIndicator(event.currentTarget);
                      }}
                      onFocus={(event) => {
                        setMobileHoverKey(link.href);
                        updateMobileIndicator(event.currentTarget);
                      }}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                );
              })}
              <SheetClose asChild>
                <Link
                  href={me ? "/settings" : "/login"}
                  className={cn(
                    "relative z-10 flex items-baseline gap-4 px-6 py-3 font-heading text-5xl font-medium leading-none tracking-[-0.055em] outline-none transition-colors sm:text-6xl",
                    mobileHighlightKey === "account"
                      ? "text-primary-foreground"
                      : "text-primary hover:text-foreground focus-visible:text-foreground",
                  )}
                  data-mobile-highlight={mobileHighlightKey === "account"}
                  data-sheet-reveal
                  style={{ animationDelay: "280ms" }}
                  onPointerEnter={(event) => {
                    setMobileHoverKey("account");
                    updateMobileIndicator(event.currentTarget);
                  }}
                  onFocus={(event) => {
                    setMobileHoverKey("account");
                    updateMobileIndicator(event.currentTarget);
                  }}
                >
                  {me ? "Settings" : "Log in"}
                </Link>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
