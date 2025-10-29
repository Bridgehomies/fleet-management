import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns"
import MaintenanceList from "@/components/fleet/maintenance-list"

export default async function VehicleDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: vehicle } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single()

  if (!vehicle) {
    redirect("/dashboard/fleet")
  }

  const { data: maintenanceRecords } = await supabase
    .from("maintenance_records")
    .select("*")
    .eq("vehicle_id", params.id)
    .order("maintenance_date", { ascending: false })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
          <p className="text-muted-foreground mt-2">{vehicle.registration_number}</p>
        </div>
        <Badge className={getStatusColor(vehicle.status)}>{vehicle.status}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Registration Number</p>
              <p className="font-medium">{vehicle.registration_number}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">License Plate</p>
              <p className="font-medium">{vehicle.license_plate || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">VIN</p>
              <p className="font-medium">{vehicle.vin || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Purchase Date</p>
              <p className="font-medium">
                {vehicle.purchase_date ? format(new Date(vehicle.purchase_date), "MMM dd, yyyy") : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link href={`/dashboard/fleet/${vehicle.id}/edit`}>
              <Button variant="outline" className="w-full bg-transparent">
                Edit Vehicle
              </Button>
            </Link>
            <Link href={`/dashboard/fleet/${vehicle.id}/maintenance/new`}>
              <Button variant="outline" className="w-full bg-transparent">
                Add Maintenance Record
              </Button>
            </Link>
            <Link href={`/dashboard/documents?vehicle=${vehicle.id}`}>
              <Button variant="outline" className="w-full bg-transparent">
                View Documents
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Maintenance Records</CardTitle>
            <Link href={`/dashboard/fleet/${vehicle.id}/maintenance/new`}>
              <Button size="sm">Add Record</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <MaintenanceList records={maintenanceRecords || []} vehicleId={vehicle.id} />
        </CardContent>
      </Card>
    </div>
  )
}
