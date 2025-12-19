import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-keepla-black text-white border-transparent",
        muted:
          "bg-keepla-gray-light text-keepla-gray-dark border-transparent",
        outline:
          "border-keepla-gray-dark text-keepla-gray-dark",
        highlight:
          "bg-keepla-red text-white border-transparent",

        secondary:
          "bg-keepla-gray text-white border-transparent",
        destructive:
          "bg-keepla-red text-white border-transparent"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
