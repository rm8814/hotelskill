import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function AccordionItem({
  question,
  children,
  className,
}: {
  question: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <details
      className={cn(
        "group rounded-2xl border border-border bg-card px-6 py-1 mb-3.5 open:pb-5",
        className
      )}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-[14.5px] font-bold text-text">
        {question}
        <ChevronDown className="h-4 w-4 shrink-0 text-text-dim transition-transform group-open:rotate-180" />
      </summary>
      <div className="text-[13.5px] leading-relaxed text-text-muted">{children}</div>
    </details>
  );
}
