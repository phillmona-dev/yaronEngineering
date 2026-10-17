import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "inverse";
type Size = "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  arrow?: "right" | "up" | false;
  className?: string;
  children: React.ReactNode;
};

type LinkProps = CommonProps & { href: string; external?: boolean } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href" | "className" | "children"
  >;
type ButtonProps = CommonProps & { href?: undefined } & Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "className" | "children"
  >;

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold tracking-[-0.005em] transition-[box-shadow,transform,background] duration-300 ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-[0.9375rem]",
  lg: "h-13 px-8 text-base",
};

const variants: Record<Variant, string> = {
  primary:
    "overflow-hidden active:scale-[0.97] hover:scale-[1.03] hover:-translate-y-0.5",
  secondary:
    "border border-border-strong bg-transparent text-foreground hover:border-gold-500 hover:bg-gold-500/[0.06]",
  ghost: "bg-transparent text-foreground hover:text-brand-text px-2",
  inverse: "bg-foreground text-background hover:bg-brand hover:text-brand-foreground",
};

function ArrowIcon({ arrow }: { arrow: "right" | "up" }) {
  const Icon = arrow === "up" ? ArrowUpRight : ArrowRight;
  return (
    <Icon
      aria-hidden
      className={cn(
        "ease-out-expo size-4 shrink-0 transition-transform duration-300",
        arrow === "up"
          ? "group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
          : "group-hover/btn:translate-x-1",
      )}
      strokeWidth={2}
    />
  );
}

/** Animated layers rendered inside the primary button */
function PrimaryInner({
  children,
  arrow,
}: {
  children: React.ReactNode;
  arrow: "right" | "up" | false;
}) {
  return (
    <>
      {/* Brand-blue base */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          background: "linear-gradient(145deg, #6ca6ee 0%, #3f82dc 55%, #3270c8 100%)",
          border: "1.5px solid rgba(245,197,24,0.35)",
        }}
      />

      {/* Gold edge glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          boxShadow:
            "0 1px 0 0 rgba(255,255,255,0.25) inset, 0 6px 24px -6px rgba(63,130,220,0.55), 0 0 0 3px rgba(245,197,24,0.16)",
          animation: "btn-glow-pulse 2.4s ease-in-out infinite",
        }}
      />

      {/* Gold shimmer sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            width: "45%",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,233,138,0.28) 50%, transparent 100%)",
            animation: "btn-shimmer 2.8s ease-in-out infinite",
          }}
        />
      </span>

      {/* Hover brightening */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.35), 0 12px 36px -10px rgba(63,130,220,0.7), 0 0 0 3px rgba(245,197,24,0.3)",
          background: "rgba(95,152,232,0.35)",
        }}
      />

      {/* White text + arrow — sit above all layers */}
      <span
        className="relative z-10 flex items-center gap-2.5"
        style={{
          color: "#ffffff",
          textShadow: "0 1px 0 rgba(14,34,80,0.25)",
        }}
      >
        <span>{children}</span>
        {arrow && <ArrowIcon arrow={arrow} />}
      </span>
    </>
  );
}

export function Button(props: LinkProps | ButtonProps) {
  const { variant = "primary", size = "md", arrow = "right", className, children } = props;
  const classes = cn(base, sizes[size], variants[variant], className);

  const content =
    variant === "primary" ? (
      <PrimaryInner arrow={arrow}>{children}</PrimaryInner>
    ) : (
      <>
        <span>{children}</span>
        {arrow && <ArrowIcon arrow={arrow} />}
      </>
    );

  if ("href" in props && typeof props.href === "string") {
    const {
      href,
      external,
      variant: _v,
      size: _s,
      arrow: _a,
      className: _c,
      children: _ch,
      ...rest
    } = props;
    void _v;
    void _s;
    void _a;
    void _c;
    void _ch;
    if (external) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...rest}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    arrow: _a,
    className: _c,
    children: _ch,
    href: _h,
    ...rest
  } = props as ButtonProps;
  void _v;
  void _s;
  void _a;
  void _c;
  void _ch;
  void _h;
  return (
    <button className={classes} {...rest}>
      {content}
    </button>
  );
}
