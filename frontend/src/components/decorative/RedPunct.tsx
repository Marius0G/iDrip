import { cn } from "@/lib/utils";

interface RedPunctProps {
  children?: string;
  className?: string;
}

export function RedPunct({ children = ".", className }: RedPunctProps) {
  return (
    <span
      className={cn(
        "text-[hsl(var(--punctuation))] font-display",
        className
      )}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}
