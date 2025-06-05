
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-xl border border-dusty-rose/30 bg-white/90 px-4 py-3 text-sm text-steel-blue ring-offset-background placeholder:text-misty-gray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earthy-burgundy/20 focus-visible:ring-offset-2 focus-visible:border-earthy-burgundy disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
