import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/** shadcn Button (from the 21st.dev animated-hero dependency list), re-skinned for the neon-dark theme. */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-[background-color,box-shadow,transform,border-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_0_0_1px_rgb(34_211_238/0.5),0_10px_34px_-10px_rgb(34_211_238/0.7)] hover:bg-primary/90 hover:shadow-[0_0_0_1px_rgb(34_211_238/0.7),0_14px_44px_-10px_rgb(34_211_238/0.85)]",
        glow: "bg-[image:var(--grad)] bg-[length:160%_100%] font-semibold text-[#05060d] shadow-[0_12px_40px_-12px_rgb(139_92_246/0.9)] hover:bg-[position:100%_0] hover:shadow-[0_16px_50px_-10px_rgb(139_92_246/1)]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-white/15 bg-white/[0.03] text-foreground hover:border-white/30 hover:bg-white/[0.08]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-muted-foreground hover:bg-white/[0.07] hover:text-foreground",
        link: "rounded-md text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3.5 text-[13px]",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
