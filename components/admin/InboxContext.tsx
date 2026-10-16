"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { admin } from "@/lib/admin/client";
import type { ContactSummary } from "@/lib/blog/types";
import { useToast } from "./Toast";

type Ctx = {
  summary: ContactSummary | null;
  refresh: () => void;
  desktopAlerts: boolean;
  enableDesktopAlerts: () => Promise<void>;
};
const InboxCtx = createContext<Ctx>({
  summary: null,
  refresh: () => undefined,
  desktopAlerts: false,
  enableDesktopAlerts: async () => undefined,
});

const POLL_MS = 45000;

/**
 * Polls the inbox summary so every admin screen shows the unread count, raises a toast when new
 * messages arrive, mirrors the count into the document title and (opt-in) fires desktop notifications.
 */
export function InboxProvider({ children }: { children: React.ReactNode }) {
  const toast = useToast();
  const [summary, setSummary] = useState<ContactSummary | null>(null);
  const [desktopAlerts, setDesktopAlerts] = useState(false);
  const lastUnread = useRef<number | null>(null);

  const refresh = useCallback(async () => {
    try {
      const s = await admin.get<ContactSummary>("contact-messages/summary");
      setSummary(s);
      if (lastUnread.current !== null && s.unread > lastUnread.current) {
        const delta = s.unread - lastUnread.current;
        const text =
          delta === 1
            ? "New message from the contact form."
            : `${delta} new messages from the contact form.`;
        toast("info", text);
        if (
          desktopAlerts &&
          typeof Notification !== "undefined" &&
          Notification.permission === "granted" &&
          document.visibilityState !== "visible"
        ) {
          try {
            const n = new Notification("Yaron CMS", { body: text, tag: "yaron-inbox" });
            n.onclick = () => {
              window.focus();
              window.location.href = "/admin/messages";
            };
          } catch {
            /* notifications unavailable */
          }
        }
      }
      lastUnread.current = s.unread;
    } catch {
      /* summary is non-critical; keep last known state */
    }
  }, [toast, desktopAlerts]);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, POLL_MS);
    const onVisible = () => document.visibilityState === "visible" && refresh();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  useEffect(() => {
    if (typeof Notification !== "undefined" && Notification.permission === "granted")
      setDesktopAlerts(true);
  }, []);

  useEffect(() => {
    const base = document.title.replace(/^\(\d+\)\s*/, "");
    document.title = summary && summary.unread > 0 ? `(${summary.unread}) ${base}` : base;
  }, [summary]);

  const enableDesktopAlerts = useCallback(async () => {
    if (typeof Notification === "undefined") return;
    const p = await Notification.requestPermission();
    setDesktopAlerts(p === "granted");
  }, []);

  return (
    <InboxCtx.Provider value={{ summary, refresh, desktopAlerts, enableDesktopAlerts }}>
      {children}
    </InboxCtx.Provider>
  );
}

export const useInbox = () => useContext(InboxCtx);
