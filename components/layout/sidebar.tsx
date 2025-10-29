"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, Truck, Bell, DollarSign, Settings, LogOut, Menu, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/fleet", label: "Fleet", icon: Truck },
  { href: "/dashboard/alerts", label: "Alerts", icon: Bell },
  { href: "/dashboard/accounting", label: "Accounting", icon: DollarSign },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/auth/login"
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "w-64 bg-card border-r border-border flex flex-col transition-all duration-300 fixed md:relative h-screen z-40",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold tracking-tight">Fleet Manager</h1>
          <p className="text-xs text-muted-foreground mt-1">Document & Fleet Management</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className="w-full justify-start gap-3"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full justify-start gap-3 bg-transparent" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
