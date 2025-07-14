import { NavLink } from "react-router-dom"
import { Home, Shield, Vault, MessageCircle, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

const navItems = [
  { to: "/dashboard", icon: Home, label: "navigation.home" },
  { to: "/safety", icon: Shield, label: "Safety" },
  { to: "/evidence", icon: Vault, label: "Evidence" },
  { to: "/chat", icon: MessageCircle, label: "navigation.chat" },
  { to: "/resources", icon: BookOpen, label: "navigation.resources" },
]

export function Navigation() {
  const { t } = useTranslation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="bg-card/95 backdrop-blur-lg border-t border-border shadow-comfort">
        <div className="flex items-center justify-around safe-left safe-right">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "nav-item mobile-scale mobile-highlight",
                  isActive
                    ? "text-primary bg-primary-soft/50"
                    : "text-muted-foreground"
                )
              }
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium leading-tight text-center">
                {item.label.includes('.') ? t(item.label) : item.label}
              </span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}