import { cva } from "class-variance-authority"

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-dusty-rose text-steel-blue hover:bg-dusty-rose/80",
        secondary:
          "border-transparent bg-misty-gray text-steel-blue hover:bg-misty-gray/80",
        destructive:
          "border-transparent bg-earthy-burgundy text-white hover:bg-earthy-burgundy/80",
        outline: "text-steel-blue border-dusty-rose/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)