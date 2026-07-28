/** @format */

import Link from "next/link";
import Image from "next/image";
import { Users, TrendingUp } from "lucide-react";

import { Soma } from "@/modules/soma/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface SomaGridCardProps {
  soma: Soma;
}

export function SomaGridCard({ soma }: SomaGridCardProps) {
  const formattedCreators = new Intl.NumberFormat("en-US", {
    notation: "compact",
  }).format(soma.memberCount);
  const formattedVisitors = new Intl.NumberFormat("en-US", {
    notation: "compact",
  }).format(soma.weeklyVisitorCount);

  return (
    <Link href={`/s/${soma.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden border border-border bg-card shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-[0_12px_28px_rgba(23,23,23,0.08)] flex flex-col">
        {/* Banner Image */}
        <div className="relative h-36 w-full bg-muted overflow-hidden shrink-0">
          {soma.coverUrl ? (
            <Image
              src={soma.coverUrl}
              alt={soma.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-background" />
          )}
        </div>

        <CardContent className="relative flex flex-col p-5 pt-0 flex-1">
          {/* Overlapping Avatar */}
          <div className="-mt-8 mb-3 z-10">
            <Avatar className="size-16 ring-4 ring-card bg-background shadow-sm">
              <AvatarImage
                src={soma.coverUrl}
                alt={soma.name}
                className="object-cover"
              />
              <AvatarFallback className="text-lg font-bold text-primary">
                {soma.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-col gap-1 mb-3">
            <h3 className="font-heading text-xl font-medium tracking-[-0.035em] text-foreground group-hover:text-primary transition-colors">
              {soma.name}
            </h3>
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              s/{soma.slug}
            </span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
            {soma.description}
          </p>

          <div className="mt-auto flex items-center gap-4 text-xs font-medium text-muted-foreground pt-4 border-t border-border">
            <div className="flex items-center gap-1.5">
              <Users className="size-4" />
              <span>{formattedCreators}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <TrendingUp className="size-4" />
              <span>{formattedVisitors}/wk</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
