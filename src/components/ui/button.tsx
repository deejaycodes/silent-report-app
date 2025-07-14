import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-target mobile-scale",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-soft hover:shadow-comfort hover:bg-primary/90 active:scale-95",
        destructive: "bg-destructive text-destructive-foreground shadow-soft hover:shadow-comfort hover:bg-destructive/90 active:scale-95",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-soft hover:shadow-comfort",
        secondary: "bg-secondary text-secondary-foreground shadow-soft hover:bg-secondary/80 hover:shadow-comfort",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        trust: "bg-gradient-trust text-primary-foreground shadow-comfort hover:shadow-sos hover:scale-105 transition-all duration-300",
        calm: "bg-gradient-calm text-foreground border border-primary/20 shadow-soft hover:shadow-comfort hover:scale-102",
        sos: "bg-destructive text-destructive-foreground shadow-sos hover:shadow-sos animate-pulse-safe hover:animate-bounce-gentle font-bold text-lg",
        success: "bg-success text-success-foreground shadow-soft hover:shadow-comfort hover:bg-success/90",
        warning: "bg-warning text-warning-foreground shadow-soft hover:shadow-comfort hover:bg-warning/90",
        info: "bg-info text-info-foreground shadow-soft hover:shadow-comfort hover:bg-info/90",
        ios: "bg-background text-foreground border border-border shadow-soft hover:bg-muted/50 backdrop-blur-sm",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        mobile: "h-12 px-6 text-base font-medium rounded-xl",
        icon: "h-11 w-11",
        "icon-sm": "h-9 w-9",
        "icon-lg": "h-12 w-12",
        sos: "h-24 w-full rounded-2xl text-xl font-bold min-h-[96px]",
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
