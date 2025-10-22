
import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-xl border border-keepla-gray/30 bg-white/90 px-4 py-3 text-sm text-keepla-black ring-offset-background placeholder:text-keepla-gray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-keepla-red/20 focus-visible:ring-offset-2 focus-visible:border-keepla-red disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
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
