import { cn } from "@/lib/utils/cn";

type Props = React.HTMLAttributes<HTMLDivElement> & { narrow?: boolean };

export function Container({ className, narrow, ...rest }: Props) {
  return <div className={cn("container-x", narrow && "max-w-[1120px]", className)} {...rest} />;
}
