"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/blog/SocialIcons";
import { useSiteContent } from "@/lib/content/context";
import { whatsappHref } from "@/lib/content/highlight";
import { cn } from "@/lib/utils/cn";

/** Scroll offset after which the button appears, so it never covers the hero's CTAs. */
const SHOW_AFTER = 240;

/**
 * Floating WhatsApp shortcut, bottom-left — the mirror of the AI assistant on the right.
 * The number and greeting come from the Company section of the admin panel.
 */
export function WhatsAppButton() {
  const { company } = useSiteContent();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > SHOW_AFTER);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  if (!company.contact.whatsappE164) return null;
  const href = whatsappHref(company.contact.whatsappE164, company.contact.whatsappGreeting);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${company.shortName} on WhatsApp (opens in a new tab)`}
      title="Chat on WhatsApp"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cn(
        "wa-fab fixed bottom-8 left-8 z-[90] flex size-[60px] items-center justify-center rounded-full text-white transition-[transform,box-shadow,opacity] duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.08] focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:outline-none max-sm:bottom-6 max-sm:left-5 max-sm:size-14",
        visible ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
      style={{
        background: "linear-gradient(135deg, #2ee37a 0%, #25D366 55%, #1da851 100%)",
        boxShadow: "0 10px 32px rgba(37, 211, 102, 0.45), 0 4px 14px rgba(21, 64, 166, 0.25)",
      }}
    >
      <span
        aria-hidden
        className="wa-fab-ring absolute inset-[-6px] rounded-full border-2 border-[#25D366]/50"
      />
      <WhatsAppIcon className="relative size-7" />
    </a>
  );
}
