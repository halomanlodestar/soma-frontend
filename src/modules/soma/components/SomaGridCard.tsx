/** @format */

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Users } from "lucide-react";

import { Soma } from "@/modules/soma/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface SomaGridCardProps {
  soma: Soma;
}

export function SomaGridCard({ soma }: SomaGridCardProps) {
  const formattedCreators = new Intl.NumberFormat("en-US", {
    notation: "compact",
  }).format(soma.memberCount);
  return (
    <Link href={`/s/${soma.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden border border-border bg-card shadow-none transition-[border-color,box-shadow] duration-200 hover:border-primary/45 hover:shadow-[0_12px_28px_rgb(38_52_46/0.08)]">
        <div className="relative h-40 w-full shrink-0 overflow-hidden bg-muted">
          {soma.coverUrl ? (
            <Image
              src={soma.coverUrl}
              alt={soma.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-primary/30 via-secondary to-background" />
          )}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-foreground/30 to-transparent" />
        </div>

        <CardHeader className="gap-2 px-5 pt-5 pb-0">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">
            s/{soma.slug}
          </p>
          <CardTitle className="font-heading text-2xl font-medium tracking-[-0.035em] text-foreground transition-colors group-hover:text-primary">
            {soma.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-1 px-5 pt-3">
          <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
            {soma.description}
          </p>
        </CardContent>

        <CardFooter className="mt-5 justify-between border-t border-border px-5 pt-4 pb-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Users className="size-4" />
            {formattedCreators} creators
          </span>
          <span className="flex items-center gap-1 text-primary">
            Explore
            <ArrowUpRight className="size-3.5" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
