import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ThemeToggle"

interface LayoutProps {
  children: ReactNode
  className?: string
  showThemeToggle?: boolean
}

export function Layout({ children, className, showThemeToggle = true }: LayoutProps) {
  return (
    <div className={cn("min-h-screen bg-gradient-calm", className)}>
      {showThemeToggle && (
        <div className="absolute top-4 right-4 z-50 safe-top">
          <ThemeToggle />
        </div>
      )}
      {children}
    </div>
  )
}