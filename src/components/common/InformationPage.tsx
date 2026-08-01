import Link from "next/link";

type InformationSection = {
  title: string;
  body: React.ReactNode;
};

type InformationPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: InformationSection[];
  aside?: React.ReactNode;
};

export function InformationPage({
  eyebrow,
  title,
  intro,
  sections,
  aside,
}: InformationPageProps) {
  return (
    <main className="min-h-screen bg-background pb-20">
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-pretty font-heading text-4xl font-medium leading-[1.1] tracking-[-0.05em] text-foreground sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {intro}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-20 lg:px-8 lg:py-16">
        <div className="max-w-3xl">
          <div className="flex flex-col gap-12">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-heading text-2xl font-medium tracking-[-0.03em] text-foreground sm:text-3xl">
                  {section.title}
                </h2>
                <div className="mt-4 flex flex-col gap-4 text-sm leading-7 text-muted-foreground sm:text-base">
                  {section.body}
                </div>
              </section>
            ))}
          </div>
        </div>

        {aside ? (
          <aside className="h-fit border-y border-border py-5 lg:sticky lg:top-24">
            {aside}
          </aside>
        ) : null}
      </div>
    </main>
  );
}

export function InformationLinks({
  links,
}: {
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <nav aria-label="Related information" className="flex flex-col gap-2">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">
        Keep reading
      </p>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="w-fit text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
