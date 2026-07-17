import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full bg-accent-soft px-3.5 py-1.5 text-xs font-semibold text-accent tracking-wide",
        className
      )}
    >
      {children}
    </span>
  );
}
