import React from "react";
import Image from "next/image";
import { Users, TrendingUp } from "lucide-react";
import { Soma } from "@/modules/soma/api/useGetSomas";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface SomaCardProps {
  soma: Soma;
}

export function SomaCard({ soma }: SomaCardProps) {
  // Format numbers safely
  const formattedCreators = new Intl.NumberFormat('en-US', { notation: "compact" }).format(soma.memberCount);
  const formattedVisitors = new Intl.NumberFormat('en-US', { notation: "compact" }).format(soma.weeklyVisitorCount);

  return (
    <div className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-accent/50 cursor-pointer group">
      <Avatar className="size-11 ring-1 ring-border/50 shadow-sm shrink-0">
        <AvatarImage src={soma.coverUrl} alt={soma.name} className="object-cover" />
        <AvatarFallback className="bg-primary/5 text-primary text-xs font-semibold">
          {soma.name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col overflow-hidden min-w-0">
        <HoverCard>
          <HoverCardTrigger asChild>
            <span className="text-sm font-bold tracking-tight text-foreground truncate group-hover:text-primary transition-colors cursor-pointer block">
              {soma.name}
            </span>
          </HoverCardTrigger>
          <HoverCardContent side="left" align="start" className="w-72 p-0 overflow-hidden shadow-xl">
            {/* Soma Banner/Cover Image */}
            <div className="relative w-full h-24 bg-muted">
              {soma.coverUrl ? (
                <Image src={soma.coverUrl} alt={soma.name} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background" />
              )}
            </div>
            
            <div className="p-4 flex flex-col gap-3">
              <div className="flex flex-col gap-0.5">
                <h4 className="text-base font-bold tracking-tight">{soma.name}</h4>
                <p className="text-xs font-medium text-primary">s/{soma.slug}</p>
              </div>
              
              <p className="text-sm text-muted-foreground leading-snug">
                {soma.description}
              </p>

              <div className="mt-2 flex items-center gap-4 text-xs font-medium text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Users className="size-4" />
                  <span>{formattedCreators} creators</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="size-4 text-green-500" />
                  <span>{formattedVisitors} / week</span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          <span className="font-medium text-primary">s/{soma.slug}</span>
          <span>•</span>
          <span className="truncate">{formattedCreators} creators</span>
        </div>
      </div>
    </div>
  );
}
