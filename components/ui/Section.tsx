import { cn } from "@/lib/utils/cn";

type Props = React.HTMLAttributes<HTMLElement> & {
  theme?: "dark" | "light";
  tone?: "soft";
  as?: "section" | "div" | "header" | "footer";
  padded?: boolean;
  /** Content drops into place as the section scrolls into view (default on). */
  drop?: boolean;
};

/** Theme-scoped section. Children use semantic colour utilities and adapt automatically. */
export function Section({
  theme = "light",
  tone,
  as: Tag = "section",
  padded = true,
  drop = true,
  className,
  children,
  ...rest
}: Props) {
  return (
    <Tag
      data-theme={theme}
      data-tone={tone}
      className={cn(
        "bg-background text-foreground relative",
        padded && "section-y",
        drop && "section-drop",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
