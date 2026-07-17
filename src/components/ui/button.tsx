import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-br from-accent to-accent-dark text-black hover:opacity-90",
        outline:
          "bg-transparent border border-border text-text hover:bg-card",
        secondary: "bg-card border border-border text-text hover:bg-card2",
        ghost: "bg-card border border-border text-text-muted hover:text-text",
      },
      size: {
        default: "h-11 px-5",
        lg: "h-14 px-6 w-full text-base",
        sm: "h-9 px-3 text-xs",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
