import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import VehicleForm from "@/components/fleet/vehicle-form"

export default async function NewVehiclePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Add New Vehicle</h1>
        <p className="text-muted-foreground mt-2">Register a new vehicle to your fleet</p>
      </div>
      <VehicleForm userId={user.id} />
    </div>
  )
}
