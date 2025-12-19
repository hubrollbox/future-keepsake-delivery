import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-keepla-gray-100 text-keepla-gray-900",
        highlight:
          "bg-keepla-red text-keepla-white",
        outline:
          "border border-keepla-gray-200 text-keepla-gray-900",
        muted:
          "bg-keepla-gray-200 text-keepla-gray-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
