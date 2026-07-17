import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full min-h-[100px] resize-y rounded-xl border border-border bg-card2 p-4 text-sm text-text placeholder:text-text-dim focus:outline-none focus:ring-1 focus:ring-accent",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
