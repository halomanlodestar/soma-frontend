import React from "react";
import { Soma } from "@/modules/soma/api/useGetSomas";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SomaCardProps {
  soma: Soma;
}

export function SomaCard({ soma }: SomaCardProps) {
  // Format member count safely
  const formattedCount = new Intl.NumberFormat('en-US', { notation: "compact" }).format(soma.memberCount);

  return (
    <div className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-accent/50 cursor-pointer group">
      <Avatar className="size-11 ring-1 ring-border/50 shadow-sm">
        <AvatarImage src={soma.coverUrl} alt={soma.name} className="object-cover" />
        <AvatarFallback className="bg-primary/5 text-primary text-xs font-semibold">
          {soma.name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col overflow-hidden">
        <span className="text-sm font-bold tracking-tight text-foreground truncate group-hover:text-primary transition-colors">
          {soma.name}
        </span>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          <span className="font-medium text-primary">s/{soma.slug}</span>
          <span>•</span>
          <span>{formattedCount} creators</span>
        </div>
      </div>
    </div>
  );
}
