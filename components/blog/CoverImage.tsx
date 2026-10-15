import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { mediaUrl } from "@/lib/blog/format";
import type { Media } from "@/lib/blog/types";

type Props = {
  media: Media | null | undefined;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  fallbackLabel?: string;
};

/** Cover image with a designed fallback when no image is set or it fails. */
export function CoverImage({
  media,
  sizes,
  priority,
  className,
  imgClassName,
  fallbackLabel = "Yaron Engineering",
}: Props) {
  if (!media?.url) {
    return (
      <div className={cn("bg-ink-900 relative overflow-hidden", className)} aria-hidden>
        <div className="grid-lines absolute inset-0 text-white opacity-60" />
        <div className="text-ink-400 absolute top-5 left-5 font-mono text-[0.66rem] tracking-[0.16em] uppercase">
          {fallbackLabel}
        </div>
        <div className="bg-brand-400 absolute bottom-5 left-5 h-px w-10" />
      </div>
    );
  }
  return (
    <div className={cn("bg-ink-900 relative overflow-hidden", className)}>
      <Image
        src={mediaUrl(media.url)}
        alt={media.altText ?? ""}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", imgClassName)}
      />
    </div>
  );
}
