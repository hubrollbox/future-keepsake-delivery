
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-dusty-rose text-steel-blue hover:bg-dusty-rose/90",
        destructive:
          "bg-earthy-burgundy text-white hover:bg-earthy-burgundy/90",
        outline:
          "border border-dusty-rose/30 bg-white/90 hover:bg-misty-gray hover:text-steel-blue",
        secondary:
          "bg-misty-gray text-steel-blue hover:bg-misty-gray/80",
        ghost: "hover:bg-dusty-rose/10 hover:text-steel-blue",
        link: "text-dusty-rose underline-offset-4 hover:underline",
        // ... existing code ...
        brand: "bg-earthy-burgundy text-white hover:bg-earthy-burgundy/90 hover:scale-[1.02] shadow-soft font-semibold",
        "brand-outline": "border-2 border-earthy-burgundy text-earthy-burgundy hover:bg-earthy-burgundy/5 hover:scale-[1.02] font-semibold",
        gentle: "bg-white/80 backdrop-blur-sm border border-dusty-rose/20 text-steel-blue hover:bg-white hover:shadow-gentle",
        // Manter compatibilidade com variantes antigas
        gold: "bg-earthy-burgundy text-white hover:bg-earthy-burgundy/90 hover:scale-[1.02] shadow-soft font-semibold",
        "gold-outline": "border-2 border-earthy-burgundy text-earthy-burgundy hover:bg-earthy-burgundy/5 hover:scale-[1.02] font-semibold",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-lg px-4",
        lg: "h-14 rounded-2xl px-8",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
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
