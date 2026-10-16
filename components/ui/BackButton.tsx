"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface BackButtonProps {
  className?: string;
}

/**
 * A browser-back button that returns the user to wherever they came from.
 * Falls back to "/" if there is no previous history entry.
 */
export function BackButton({ className }: BackButtonProps) {
  const router = useRouter();

  function handleBack() {
    // If the user opened this page directly (no history), go home
    if (window.history.length <= 1) {
      router.push("/");
    } else {
      router.back();
    }
  }

  return (
    <button
      onClick={handleBack}
      aria-label="Go back to previous page"
      className={cn(
        "group inline-flex items-center gap-2",
        "rounded-full border border-white/20 bg-white/10 backdrop-blur-sm",
        "px-4 py-2 text-[0.75rem] font-semibold tracking-[0.08em] uppercase",
        "text-white/80 hover:text-white",
        "hover:bg-white/20 hover:border-white/40",
        "transition-all duration-200 cursor-pointer",
        className,
      )}
    >
      <ArrowLeft
        className="size-3.5 transition-transform duration-200 group-hover:-translate-x-1"
        strokeWidth={2.5}
        aria-hidden
      />
      Back
    </button>
  );
}
