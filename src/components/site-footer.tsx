import Link from "next/link";

const footerGroups = [
  {
    title: "Soma",
    links: [
      { href: "/how-it-works", label: "How It Works" },
      { href: "/explore", label: "Explore" },
      { href: "/guidelines", label: "Guidelines" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/support", label: "Support" },
      { href: "/contact", label: "Contact" },
      { href: "/accessibility", label: "Accessibility" },
    ],
  },
  {
    title: "Policies",
    links: [
      { href: "/content-policy", label: "Content Policy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,10rem))] lg:gap-8 lg:px-8">
        <div className="max-w-sm">
          <Link
            href="/"
            className="font-heading text-2xl font-medium tracking-[-0.04em] text-foreground"
          >
            soma
          </Link>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            A quieter home for work made by people.
          </p>
        </div>

        {footerGroups.map((group) => (
          <nav key={group.title} aria-label={group.title} className="flex flex-col gap-3">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">
              {group.title}
            </p>
            {group.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Soma</p>
          <p>Quality over quantity, always.</p>
        </div>
      </div>
    </footer>
  );
}
