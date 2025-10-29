"use client"

import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Bell, Settings } from "lucide-react"
import Link from "next/link"

interface HeaderProps {
  user: User
  profile: any
}

export default function Header({ user, profile }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="px-6 md:px-8 py-4 flex items-center justify-between">
        <div className="hidden md:block">
          <h2 className="text-sm text-muted-foreground">Welcome back,</h2>
          <p className="text-lg font-semibold">{profile?.full_name || user.email}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/alerts">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/dashboard/settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
