import { cn } from "@/lib/utils/cn";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "@/components/animations/Reveal";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
  children?: React.ReactNode;
};

export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
  as: Heading = "h2",
  children,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 md:gap-6",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <Eyebrow accent={align !== "center"}>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <Heading
          className={cn("max-w-[18ch] font-semibold", Heading === "h1" ? "text-h1" : "text-h2")}
        >
          {title}
        </Heading>
      </Reveal>
      {lead && (
        <Reveal delay={0.16}>
          <p className="text-lead text-muted-foreground max-w-[58ch]">{lead}</p>
        </Reveal>
      )}
      {children}
    </div>
  );
}
