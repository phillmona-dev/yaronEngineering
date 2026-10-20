import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LinkedInIcon } from "./SocialIcons";
import type { Author, AuthorRef } from "@/lib/blog/types";
import { mediaUrl } from "@/lib/blog/format";
import { cn } from "@/lib/utils/cn";

export function AuthorAvatar({
  author,
  size = 56,
  className,
}: {
  author: AuthorRef | Author;
  size?: number;
  className?: string;
}) {
  const initials = author.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  if (author.avatar?.url) {
    return (
      <Image
        src={mediaUrl(author.avatar.url)}
        alt={author.avatar.altText || author.name}
        width={size}
        height={size}
        className={cn("rounded-full object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className={cn(
        "bg-ink-900 text-ink-200 font-label flex items-center justify-center rounded-full text-[0.7rem] font-semibold tracking-[0.14em]",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

export function AuthorCard({ author, compact = false }: { author: Author; compact?: boolean }) {
  return (
    <div
      className={cn(
        "border-border bg-surface flex gap-5 rounded-md border",
        compact ? "p-5" : "p-6 lg:p-8",
      )}
    >
      <AuthorAvatar author={author} size={compact ? 48 : 64} className="shrink-0" />
      <div className="min-w-0">
        <p className="text-muted-foreground font-label text-[0.7rem] font-semibold tracking-[0.14em] uppercase">
          Written by
        </p>
        <p className="text-h4 mt-1 font-semibold">
          <Link href={`/blog/author/${author.slug}`} className="hover:text-brand-text">
            {author.name}
          </Link>
        </p>
        {author.position && <p className="text-muted-foreground text-body">{author.position}</p>}
        {!compact && author.bio && (
          <p className="text-muted-foreground text-body mt-3 max-w-[60ch]">{author.bio}</p>
        )}
        <div className="text-body mt-4 flex flex-wrap items-center gap-5">
          <Link
            href={`/blog/author/${author.slug}`}
            className="group text-brand-text inline-flex items-center gap-1.5 font-medium"
          >
            All articles
            <ArrowUpRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </Link>
          {author.linkedinUrl && (
            <a
              href={author.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
            >
              <LinkedInIcon className="size-3.5" /> LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
