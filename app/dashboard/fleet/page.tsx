import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import FleetList from "@/components/fleet/fleet-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function FleetPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fleet Management</h1>
          <p className="text-muted-foreground mt-2">Manage your vehicles and maintenance records</p>
        </div>
        <Link href="/dashboard/fleet/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Vehicle
          </Button>
        </Link>
      </div>

      <FleetList vehicles={vehicles || []} />
    </div>
  )
}
