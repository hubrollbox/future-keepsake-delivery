import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-keepla-black text-white hover:bg-keepla-gray-dark",
        outline:
          "border border-keepla-gray-dark text-keepla-gray-dark hover:bg-keepla-gray-light",
        ghost:
          "text-keepla-gray-dark hover:bg-keepla-gray-light",
        subtle:
          "bg-keepla-gray-light text-keepla-gray-dark hover:bg-keepla-gray",
        danger:
          "bg-keepla-red text-white hover:opacity-90",

        /* KEEPLA */
        brand:
          "bg-keepla-black text-white hover:bg-keepla-gray-dark",
        "brand-outline":
          "border border-keepla-black text-keepla-black hover:bg-keepla-gray-light",
        link:
          "text-keepla-black underline-offset-4 hover:underline",
        gentle:
          "bg-transparent text-keepla-gray hover:text-keepla-black"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
