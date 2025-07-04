
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-dusty-rose/30 bg-white/90 px-4 py-3 text-sm text-steel-blue ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-steel-blue placeholder:text-misty-gray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earthy-burgundy/20 focus-visible:ring-offset-2 focus-visible:border-earthy-burgundy disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
