import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary/90 selection:text-primary-foreground border-border/70 flex h-12 w-full min-w-0 rounded-full border bg-transparent px-5 text-sm uppercase tracking-[0.18em] transition-all duration-200 outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:px-3 file:text-[11px] file:font-semibold file:uppercase file:tracking-[0.28em] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60",
        "focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props} />
  );
}

export { Input }
