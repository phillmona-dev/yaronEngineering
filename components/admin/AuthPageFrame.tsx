import { LogoMark } from "@/components/ui/Logo";

/**
 * Full-screen glassmorphic auth wrapper — animated background slideshow,
 * spinning compass, frosted glass card. Used by sign-in and password-recovery pages.
 *
 * Background cycles through 5 no-people tech images via CSS crossfade (40 s loop).
 */
export function AuthPageFrame({
  kicker,
  children,
  footer = "Authorised Yaron Engineering staff only.",
}: {
  kicker: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  /** Images cycle: each visible for 8 s, 2 s crossfade — total 40 s loop */
  const SLIDES = [
    "/images/photos/hero-datacenter.jpg",
    "/images/photos/network-patch.jpg",
    "/images/photos/circuit.jpg",
    "/images/photos/rack-mono.jpg",
    "/images/photos/cloud-nodes.jpg",
  ];

  return (
    <>
      {/* ── Keyframe animations ─────────────────────────────────────────── */}
      <style>{`
        /* ── Background slideshow ── */
        @keyframes bgFade {
          /*  0-5%   : fade in          */
          /*  5-25%  : hold visible     */
          /*  25-30% : fade out         */
          /*  30-100%: stay hidden      */
          0%   { opacity: 0; }
          5%   { opacity: 1; }
          25%  { opacity: 1; }
          30%  { opacity: 0; }
          100% { opacity: 0; }
        }
        /* Ken-Burns subtle zoom */
        @keyframes bgZoom {
          from { transform: scale(1);    }
          to   { transform: scale(1.08); }
        }
        .bg-slide {
          animation: bgFade 40s linear infinite,
                     bgZoom 40s ease-in-out infinite alternate;
        }
        .bg-s1 { animation-delay: 0s,  0s;  }
        .bg-s2 { animation-delay: 8s,  8s;  }
        .bg-s3 { animation-delay: 16s, 16s; }
        .bg-s4 { animation-delay: 24s, 24s; }
        .bg-s5 { animation-delay: 32s, 32s; }

        /* ── Compass & orbs ── */
        @keyframes compassSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes authOrb1 {
          0%,100% { transform: translate(0,0) scale(1);        opacity:.25; }
          50%     { transform: translate(40px,-30px) scale(1.15); opacity:.45; }
        }
        @keyframes authOrb2 {
          0%,100% { transform: translate(0,0) scale(1);       opacity:.18; }
          50%     { transform: translate(-30px,40px) scale(.9); opacity:.38; }
        }
        @keyframes authOrb3 {
          0%,100% { transform: translate(0,0) scale(1);      opacity:.12; }
          50%     { transform: translate(20px,20px) scale(1.1); opacity:.28; }
        }
        .auth-compass { animation: compassSpin 14s linear infinite; }
        .auth-orb-1   { animation: authOrb1 9s  ease-in-out infinite; }
        .auth-orb-2   { animation: authOrb2 11s ease-in-out infinite; }
        .auth-orb-3   { animation: authOrb3 7s  ease-in-out infinite; }

        /* ── form element overrides inside the glass card ── */
        .auth-glass label               { color: rgba(255,255,255,.65) !important; }
        .auth-glass input               { background: rgba(255,255,255,.12) !important;
                                          border-color: rgba(255,255,255,.25) !important;
                                          color: #fff !important;
                                          backdrop-filter: blur(8px); }
        .auth-glass input::placeholder  { color: rgba(255,255,255,.35) !important; }
        .auth-glass input:focus         { background: rgba(255,255,255,.18) !important;
                                          border-color: rgba(34,211,238,.6) !important;
                                          box-shadow: 0 0 0 3px rgba(34,211,238,.18) !important; }
        .auth-glass button[type=submit] { background: linear-gradient(135deg,#1d4ed8,#0891b2) !important;
                                          border-color: transparent !important;
                                          box-shadow: 0 8px 24px -6px rgba(8,145,178,.55) !important;
                                          color: #fff !important; }
        .auth-glass button[type=submit]:hover {
                                          background: linear-gradient(135deg,#1e40af,#0e7490) !important;
                                          box-shadow: 0 12px 28px -6px rgba(8,145,178,.7) !important; }
        .auth-glass .text-brand-700     { color: rgba(103,232,249,.85) !important; }
        .auth-glass [role=alert]        { background: rgba(239,68,68,.18) !important;
                                          border-color: rgba(239,68,68,.35) !important;
                                          color: #fca5a5 !important; }
        .auth-glass [role=status]       { background: rgba(16,185,129,.18) !important;
                                          border-color: rgba(16,185,129,.35) !important;
                                          color: #6ee7b7 !important; }
        /* eye-toggle button inside password field */
        .auth-glass button:not([type=submit]) { background: transparent !important;
                                                 border-color: transparent !important;
                                                 box-shadow: none !important;
                                                 color: rgba(255,255,255,.5) !important; }
        .auth-glass button:not([type=submit]):hover { color: rgba(255,255,255,.9) !important; }
      `}</style>

      {/* ── Full-screen shell ────────────────────────────────────────────── */}
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-6">

        {/* ── Animated background slideshow ── */}
        {SLIDES.map((src, i) => (
          <div
            key={src}
            className={`bg-slide bg-s${i + 1} absolute inset-0 bg-cover bg-center bg-no-repeat`}
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}

        {/* Gradient overlay — keeps images visible while giving depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-blue-950/70 to-cyan-950/75" />

        {/* Ambient glow orbs */}
        <div className="auth-orb-1 pointer-events-none absolute -left-24 top-1/4  h-[520px] w-[520px] rounded-full bg-blue-600/25  blur-3xl" />
        <div className="auth-orb-2 pointer-events-none absolute -right-24 bottom-1/4 h-[420px] w-[420px] rounded-full bg-cyan-500/20  blur-3xl" />
        <div className="auth-orb-3 pointer-events-none absolute bottom-10 left-1/3  h-[300px] w-[300px] rounded-full bg-indigo-500/15 blur-3xl" />

        {/* ── Content ───────────────────────────────────────────────────── */}
        <div className="relative z-10 w-full max-w-sm">

          {/* Logo + title */}
          <div className="mb-8 flex items-center gap-4">
            <div
              className="auth-compass shrink-0 rounded-full p-1"
              style={{ filter: "drop-shadow(0 0 14px rgba(34,211,238,.7))" }}
            >
              <LogoMark size={52} />
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight text-white drop-shadow-md">
                Yaron CMS
              </p>
              <p className="mt-0.5 font-mono text-[0.62rem] tracking-[0.18em] uppercase text-cyan-300/80">
                Knowledge Hub · {kicker}
              </p>
            </div>
          </div>

          {/* Glassmorphic card */}
          <div
            className="auth-glass rounded-2xl border border-white/20 p-7 shadow-[0_30px_60px_rgba(0,0,0,.45),inset_0_1px_0_rgba(255,255,255,.18)]"
            style={{ background: "rgba(255,255,255,0.09)", backdropFilter: "blur(28px)" }}
          >
            {children}
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs tracking-wide text-white/30">
            {footer}
          </p>
        </div>
      </div>
    </>
  );
}
