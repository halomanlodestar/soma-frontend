/** @format */

import Link from "next/link";
import { FileText, Paperclip } from "lucide-react";

import type { PostAttachment } from "@/modules/post/types";

interface PostAttachmentsProps {
  attachments: PostAttachment[];
  postTitle: string;
  postHref?: string;
}

const imageExtension = /\.(avif|gif|jpe?g|png|svg|webp)(?:\?|$)/i;
const videoExtension = /\.(m4v|mov|mp4|webm)(?:\?|$)/i;

function isImage(attachment: PostAttachment) {
  return (
    attachment.type.toLowerCase().includes("image") ||
    imageExtension.test(attachment.originalUrl)
  );
}

function isVideo(attachment: PostAttachment) {
  return (
    attachment.type.toLowerCase().includes("video") ||
    videoExtension.test(attachment.originalUrl)
  );
}

function attachmentLabel(type: string, index: number) {
  const readableType = type.split("/").pop()?.replaceAll("-", " ") || "file";
  return `${readableType} attachment ${index + 1}`;
}

export function PostAttachments({
  attachments,
  postTitle,
  postHref,
}: PostAttachmentsProps) {
  const uniqueAttachments = attachments.filter(
    (attachment, index) =>
      attachment.originalUrl &&
      attachments.findIndex(
        (candidate) => candidate.originalUrl === attachment.originalUrl,
      ) === index,
  );

  if (!uniqueAttachments.length) {
    return null;
  }

  const visualAttachments = uniqueAttachments.filter(
    (attachment) => isImage(attachment) || isVideo(attachment),
  );
  const fileAttachments = uniqueAttachments.filter(
    (attachment) => !isImage(attachment) && !isVideo(attachment),
  );
  return (
    <div className="flex flex-col gap-3">
      {visualAttachments.length > 0 && (
        <div className="flex flex-col gap-2">
          {visualAttachments.map((attachment, index) => {
            const label = `${postTitle} — ${attachmentLabel(attachment.type, index)}`;
            const className =
              "block w-full overflow-hidden rounded-sm bg-muted";

            if (isVideo(attachment)) {
              return (
                <video
                  key={attachment.originalUrl}
                  controls
                  preload="metadata"
                  className={`${className} h-auto`}
                  aria-label={label}
                >
                  <source src={attachment.originalUrl} type={attachment.type} />
                  Your browser does not support this video.
                </video>
              );
            }

            const image = (
              /* eslint-disable-next-line @next/next/no-img-element -- The media API does not expose the intrinsic dimensions required by next/image. */
              <img
                src={attachment.originalUrl}
                alt={label}
                className={`${className} h-auto`}
              />
            );

            return postHref ? (
              <Link
                key={attachment.originalUrl}
                href={postHref}
                aria-label={`Open ${postTitle}`}
              >
                {image}
              </Link>
            ) : (
              <a
                key={attachment.originalUrl}
                href={attachment.originalUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${label}`}
              >
                {image}
              </a>
            );
          })}
        </div>
      )}

      {fileAttachments.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {fileAttachments.map((attachment, index) => (
            <a
              key={attachment.originalUrl}
              href={attachment.originalUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex min-h-16 items-center gap-3 rounded-lg border border-border bg-muted/35 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-accent/50"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground ring-1 ring-border">
                <FileText className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">
                  {attachmentLabel(attachment.type, index)}
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <Paperclip className="size-3" aria-hidden="true" />
                  Open attachment
                </span>
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
