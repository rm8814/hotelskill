import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border bg-card p-6",
        className
      )}
      {...props}
    />
  );
}

export function CardBadge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("mb-3 text-xs font-bold text-text-dim tracking-wide", className)}>
      {children}
    </div>
  );
}
