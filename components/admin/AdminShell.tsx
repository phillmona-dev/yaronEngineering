"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Tags,
  Users,
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  PenSquare,
  Inbox as InboxIcon,
  Bell,
  BellOff,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { admin } from "@/lib/admin/client";
import type { User } from "@/lib/blog/types";
import { LogoMark } from "@/components/ui/Logo";
import { ToastProvider } from "./Toast";
import { InboxProvider, useInbox } from "./InboxContext";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: InboxIcon, badge: true },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/tags", label: "Tags", icon: Tags },
  { href: "/admin/authors", label: "Authors", icon: Users },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings, adminOnly: true },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <InboxProvider>
        <Shell>{children}</Shell>
      </InboxProvider>
    </ToastProvider>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { summary, desktopAlerts, enableDesktopAlerts } = useInbox();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    admin
      .get<User>("auth/me")
      .then(setUser)
      .catch(() => undefined);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  const items = nav.filter((n) => !n.adminOnly || user?.role === "ADMIN");

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="border-ink-200 flex h-14 items-center gap-3 border-b px-4">
        <LogoMark size={28} />
        <div className="leading-tight">
          <p className="text-ink-900 text-sm font-semibold">Yaron CMS</p>
          <p className="text-ink-400 font-mono text-[0.6rem] tracking-[0.14em] uppercase">
            Knowledge Hub
          </p>
        </div>
      </div>
      <div className="p-3">
        <Link
          href="/admin/articles/new"
          className="bg-brand-500 hover:bg-brand-600 flex h-9 items-center justify-center gap-2 rounded-md text-sm font-medium text-white"
        >
          <PenSquare className="size-4" aria-hidden /> New article
        </Link>
      </div>
      <nav aria-label="Admin" className="flex-1 px-3">
        <ul className="flex flex-col gap-0.5">
          {items.map((n) => {
            const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
            return (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-9 items-center gap-3 rounded-md px-3 text-sm transition-colors",
                    active
                      ? "bg-ink-100 text-ink-900 font-medium"
                      : "text-ink-500 hover:bg-ink-50 hover:text-ink-900",
                  )}
                >
                  <n.icon className="size-4" aria-hidden /> {n.label}
                  {"badge" in n && n.badge && summary && summary.unread > 0 && (
                    <span
                      className="bg-brand-500 ml-auto rounded-full px-1.5 py-0.5 font-mono text-[0.6rem] leading-none text-white"
                      aria-label={`${summary.unread} unread messages`}
                    >
                      {summary.unread}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-ink-200 border-t p-3">
        <button
          type="button"
          onClick={enableDesktopAlerts}
          disabled={desktopAlerts}
          className="text-ink-500 hover:bg-ink-50 hover:text-ink-900 disabled:text-ink-400 flex h-9 w-full items-center gap-3 rounded-md px-3 text-sm"
          title={
            desktopAlerts
              ? "Desktop alerts are on"
              : "Get a desktop notification when a new message arrives"
          }
        >
          {desktopAlerts ? (
            <Bell className="size-4" aria-hidden />
          ) : (
            <BellOff className="size-4" aria-hidden />
          )}{" "}
          {desktopAlerts ? "Desktop alerts on" : "Enable desktop alerts"}
        </button>
        <Link
          href="/blog"
          target="_blank"
          className="text-ink-500 hover:bg-ink-50 hover:text-ink-900 flex h-9 items-center gap-3 rounded-md px-3 text-sm"
        >
          <ExternalLink className="size-4" aria-hidden /> View site
        </Link>
        <div className="mt-2 flex items-center justify-between rounded-md px-3 py-2">
          <div className="min-w-0">
            <p className="text-ink-900 truncate text-sm font-medium">{user?.name ?? "…"}</p>
            <p className="text-ink-400 font-mono text-[0.6rem] tracking-[0.12em] uppercase">
              {user?.role ?? ""}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            aria-label="Sign out"
            title="Sign out"
            className="text-ink-400 hover:bg-ink-50 hover:text-ink-900 rounded-md p-1.5"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div data-theme="light" className="bg-ink-50 text-ink-900 min-h-screen antialiased">
        <aside className="border-ink-200 fixed inset-y-0 left-0 z-40 hidden w-60 border-r bg-white lg:block">
          {sidebar}
        </aside>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="bg-ink-950/40 absolute inset-0" onClick={() => setOpen(false)} />
            <aside className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="text-ink-400 absolute top-3 right-2 rounded-md p-1.5"
              >
                <X className="size-4" />
              </button>
              {sidebar}
            </aside>
          </div>
        )}
        <div className="lg:pl-60">
          <header className="border-ink-200 sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-white/90 px-4 backdrop-blur lg:hidden">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="text-ink-500 rounded-md p-1.5"
            >
              <Menu className="size-5" />
            </button>
            <LogoMark size={24} />
            <span className="text-sm font-semibold">Yaron CMS</span>
            {summary && summary.unread > 0 && (
              <Link
                href="/admin/messages"
                className="bg-brand-500/10 text-brand-700 ml-auto inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium"
                aria-label={`${summary.unread} unread messages`}
              >
                <InboxIcon className="size-3.5" aria-hidden /> {summary.unread}
              </Link>
            )}
          </header>
          <main className="mx-auto max-w-[1280px] p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </>
  );
}
