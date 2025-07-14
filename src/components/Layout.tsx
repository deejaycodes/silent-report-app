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
    <div className={cn("min-h-screen bg-gradient-calm", className)}>
      {showThemeToggle && (
        <div className="absolute top-4 right-4 z-40 flex gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      )}
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  )
}