import { LogoMark } from "@/components/ui/Logo";

/** Centered card used by the sign-in and password recovery pages (no CMS shell). */
export function AuthPageFrame({
  kicker,
  children,
  footer = "Authorised Yaron Engineering staff only.",
}: {
  kicker: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div
      data-theme="light"
      className="bg-ink-50 text-ink-900 flex min-h-screen items-center justify-center p-6"
    >
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <LogoMark size={36} />
          <div>
            <p className="text-base font-semibold">Yaron CMS</p>
            <p className="text-ink-400 font-mono text-[0.62rem] tracking-[0.14em] uppercase">
              Knowledge Hub · {kicker}
            </p>
          </div>
        </div>
        <div className="border-ink-200 rounded-lg border bg-white p-6 shadow-sm">{children}</div>
        <p className="text-ink-400 mt-6 text-center text-xs">{footer}</p>
      </div>
    </div>
  );
}
