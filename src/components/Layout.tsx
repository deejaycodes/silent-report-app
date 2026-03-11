import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"

interface LayoutProps {
  children: ReactNode
  className?: string
  showThemeToggle?: boolean
}

export function Layout({ children, className, showThemeToggle = true }: LayoutProps) {
  return (
    <div className={cn("min-h-screen bg-gradient-calm safe-top safe-bottom", className)}>
      {showThemeToggle && (
        <div className="absolute top-4 right-4 z-50 flex gap-2" style={{ marginTop: 'env(safe-area-inset-top)' }}>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      )}
      {children}
    </div>
  )
}