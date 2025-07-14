import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Home, FileText, MessageCircle, MapPin, Clock, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/report", icon: FileText, label: "Report" },
  { to: "/chat", icon: MessageCircle, label: "Chat" },
  { to: "/resources", icon: MapPin, label: "Resources" },
  { to: "/history", icon: Clock, label: "History" },
]

export function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-md border-t border-border shadow-comfort">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 min-w-[60px]",
                isActive
                  ? "text-primary bg-primary-soft shadow-soft"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}