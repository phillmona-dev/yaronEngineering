"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Toast = { id: number; kind: "success" | "error" | "info"; text: string };
const Ctx = createContext<{ toast: (kind: Toast["kind"], text: string) => void }>({
  toast: () => undefined,
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const toast = useCallback((kind: Toast["kind"], text: string) => {
    const id = Date.now() + Math.random();
    setItems((l) => [...l, { id, kind, text }]);
    setTimeout(() => setItems((l) => l.filter((t) => t.id !== id)), 4500);
  }, []);
  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div
        className="pointer-events-none fixed right-4 bottom-4 z-[95] flex w-80 flex-col gap-2"
        aria-live="polite"
      >
        {items.map((t) => {
          const Icon =
            t.kind === "success" ? CheckCircle2 : t.kind === "error" ? AlertTriangle : Info;
          return (
            <div
              key={t.id}
              className={cn(
                "glass glass-strong glass-pop pointer-events-auto flex items-start gap-3 p-3 text-sm",
                t.kind === "error" && "border-red-200/80",
              )}
            >
              <Icon
                className={cn(
                  "mt-0.5 size-4 shrink-0",
                  t.kind === "success"
                    ? "text-emerald-600"
                    : t.kind === "error"
                      ? "text-red-600"
                      : "text-brand-500",
                )}
                aria-hidden
              />
              <p className="text-ink-900 flex-1">{t.text}</p>
              <button
                type="button"
                onClick={() => setItems((l) => l.filter((x) => x.id !== t.id))}
                aria-label="Dismiss"
                className="text-ink-400 hover:text-ink-900"
              >
                <X className="size-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx).toast;
