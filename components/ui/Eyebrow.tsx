import { cn } from "@/lib/utils/cn";

type Props = React.HTMLAttributes<HTMLParagraphElement> & { accent?: boolean };

export function Eyebrow({ className, accent = true, children, ...rest }: Props) {
  return (
    <p className={cn("eyebrow flex items-center gap-3", className)} {...rest}>
      {accent && <span aria-hidden className="bg-brand h-px w-6" />}
      <span>{children}</span>
    </p>
  );
}
