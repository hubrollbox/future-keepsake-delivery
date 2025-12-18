import { cva } from "class-variance-authority"

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-keepla-red text-white hover:bg-keepla-red/80",
        secondary:
          "border-transparent bg-keepla-gray-light text-keepla-gray-dark hover:bg-keepla-gray-light/80",
        destructive:
          "border-transparent bg-keepla-red text-white hover:bg-keepla-red/80",
        outline: "text-keepla-gray-dark border-keepla-red/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)