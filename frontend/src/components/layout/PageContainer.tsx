import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("w-full max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-6", className)}>
      {children}
    </div>
  );
}
