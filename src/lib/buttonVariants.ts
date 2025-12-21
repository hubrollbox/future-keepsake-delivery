import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Brand Book: CTA padrão usa #C6282E (Deep Red CTA)
        default: "bg-keepla-red text-white hover:bg-keepla-red/90 rounded-xl shadow-keepla-sm",
        
        // Brand Book: Destaque emocional principal (#E63946)
        brand: "bg-keepla-red text-white hover:bg-keepla-red/90 rounded-xl shadow-keepla-sm font-medium",
        
        // Brand Book: Outline com vermelho Keepla
        "brand-outline": "border-2 border-keepla-red bg-transparent text-keepla-red hover:bg-keepla-red hover:text-white rounded-xl transition-all",
        
        // Brand Book: Botão suave/neutro
        gentle: "bg-keepla-gray-neutral text-keepla-black hover:bg-keepla-gray-neutral/80 rounded-xl",
        
        // Variantes compatibilidade
        outline: "border-2 border-keepla-red bg-transparent text-keepla-red hover:bg-keepla-red/10 rounded-xl",
        secondary: "bg-keepla-gray-neutral text-keepla-black hover:bg-keepla-gray-neutral/80 rounded-xl",
        destructive: "bg-keepla-red text-white hover:bg-keepla-red/90 rounded-xl",
        ghost: "hover:bg-keepla-gray-neutral hover:text-keepla-black rounded-xl",
        link: "text-keepla-red underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)