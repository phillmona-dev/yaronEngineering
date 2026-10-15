import { cn } from "@/lib/utils/cn";

type Props = React.HTMLAttributes<HTMLElement> & {
  theme?: "dark" | "light";
  tone?: "soft";
  as?: "section" | "div" | "header" | "footer";
  padded?: boolean;
};

/** Theme-scoped section. Children use semantic colour utilities and adapt automatically. */
export function Section({
  theme = "light",
  tone,
  as: Tag = "section",
  padded = true,
  className,
  children,
  ...rest
}: Props) {
  return (
    <Tag
      data-theme={theme}
      data-tone={tone}
      className={cn("bg-background text-foreground relative", padded && "section-y", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
