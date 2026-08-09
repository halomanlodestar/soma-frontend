import type { PostAttachment } from "@/modules/post/types";

import { MediaImage } from "./MediaImage";

interface MediaProps {
  attachment: PostAttachment;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/**
 * Media dispatcher. Add MediaVideo and MediaAudio branches here when those
 * formats are introduced; images are the only supported visual media today.
 */
export function Media({
  attachment,
  alt,
  sizes,
  priority,
  className,
}: MediaProps) {
  return (
    <MediaImage
      src={attachment.originalUrl}
      alt={alt}
      width={attachment.metadata?.width}
      height={attachment.metadata?.height}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
