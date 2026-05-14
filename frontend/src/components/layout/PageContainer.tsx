import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  noTopPadding?: boolean;
}

export function PageContainer({ children, className, noTopPadding }: PageContainerProps) {
  return (
    <div className={cn(
      "w-full max-w-7xl mx-auto px-4 md:px-6 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-6",
      noTopPadding ? "pt-0" : "py-6",
      className
    )}>
      {children}
    </div>
  );
}
