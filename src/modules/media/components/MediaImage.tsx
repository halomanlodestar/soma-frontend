/** @format */

"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface MediaImageProps {
  src: string;
  alt: string;
  width?: number | null;
  height?: number | null;
  sizes: string;
  priority?: boolean;
  className?: string;
}

export function MediaImage({
  src,
  alt,
  width,
  height,
  sizes,
  priority = false,
  className,
}: MediaImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const hasDimensions =
    typeof width === "number" &&
    width > 0 &&
    typeof height === "number" &&
    height > 0;

  if (!hasDimensions) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- Legacy media does not have dimensions required for a correct next/image ratio.
      <img src={src} alt={alt} className={cn("h-auto w-full", className)} />
    );
  }

  return (
    <div
      className={cn("relative w-full overflow-hidden bg-muted", className)}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 animate-pulse bg-muted-foreground/10 transition-opacity duration-200 motion-reduce:animate-none motion-reduce:transition-none",
          isLoaded && "opacity-0",
        )}
      />
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        unoptimized
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "relative h-full w-full object-contain transition-opacity duration-200 motion-reduce:transition-none",
          isLoaded ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
