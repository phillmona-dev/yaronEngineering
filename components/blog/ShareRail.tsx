"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { FacebookIcon, LinkedInIcon, WhatsAppIcon, XIcon } from "./SocialIcons";
import { cn } from "@/lib/utils/cn";

export function ShareRail({
  url,
  title,
  orientation = "vertical",
  className,
}: {
  url: string;
  title: string;
  orientation?: "vertical" | "horizontal";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      Icon: LinkedInIcon,
    },
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
      Icon: XIcon,
    },
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      Icon: FacebookIcon,
    },
    { label: "Share on WhatsApp", href: `https://wa.me/?text=${t}%20${u}`, Icon: WhatsAppIcon },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }

  const btn =
    "flex size-9 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:border-brand hover:text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-hover";

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        orientation === "vertical" && "flex-col items-start",
        className,
      )}
      aria-label="Share this article"
      role="group"
    >
      <span
        className={cn(
          "text-muted-foreground font-mono text-[0.66rem] tracking-[0.14em] uppercase",
          orientation === "vertical" ? "mb-1" : "mr-1",
        )}
      >
        Share
      </span>
      {links.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className={btn}
        >
          <Icon className="size-4" />
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Link copied" : "Copy link"}
        title="Copy link"
        className={cn(btn, copied && "border-brand text-brand-text")}
      >
        {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
      </button>
    </div>
  );
}
