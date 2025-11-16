import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-xs font-semibold uppercase tracking-[0.22em] transition-all duration-200 disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_12px_24px_-16px_rgba(29,58,138,0.6)] hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/30",
        outline:
          "border border-border bg-transparent text-foreground shadow-[0_10px_24px_-20px_rgba(0,0,0,0.6)] hover:border-foreground/70 hover:bg-accent hover:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[0_10px_24px_-20px_rgba(0,0,0,0.6)] hover:bg-secondary/90",
        ghost:
          "hover:bg-accent hover:text-foreground",
        link: "text-primary underline underline-offset-8 hover:text-primary/80",
      },
      size: {
        default: "h-11 px-6 has-[>svg]:pl-5",
        sm: "h-9 px-5 has-[>svg]:pl-4 text-[11px]",
        lg: "h-12 px-7 has-[>svg]:pl-6",
        icon: "h-11 w-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
