import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, Truck, AlertCircle, TrendingUp } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch dashboard statistics
  const [{ data: documents }, { data: vehicles }, { data: alerts }] = await Promise.all([
    supabase.from("documents").select("id, status").eq("user_id", user.id),
    supabase.from("vehicles").select("id, status").eq("user_id", user.id),
    supabase.from("expiry_alerts").select("id, is_acknowledged").eq("user_id", user.id).eq("is_acknowledged", false),
  ])

  const expiredDocuments = documents?.filter((d) => d.status === "expired").length || 0
  const expiringDocuments = documents?.filter((d) => d.status === "expiring_soon").length || 0
  const activeVehicles = vehicles?.filter((v) => v.status === "active").length || 0
  const unacknowledgedAlerts = alerts?.length || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of your fleet and document management</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {expiringDocuments} expiring soon, {expiredDocuments} expired
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Active Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeVehicles}</div>
            <p className="text-xs text-muted-foreground mt-1">Out of {vehicles?.length || 0} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Pending Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{unacknowledgedAlerts}</div>
            <p className="text-xs text-muted-foreground mt-1">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard/documents/new">
              <Button variant="outline" className="w-full bg-transparent">
                Add Document
              </Button>
            </Link>
            <Link href="/dashboard/fleet/new">
              <Button variant="outline" className="w-full bg-transparent">
                Add Vehicle
              </Button>
            </Link>
            <Link href="/dashboard/alerts">
              <Button variant="outline" className="w-full bg-transparent">
                View Alerts
              </Button>
            </Link>
            <Link href="/dashboard/accounting">
              <Button variant="outline" className="w-full bg-transparent">
                View Transactions
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Latest documents added to the system</p>
            <Link href="/dashboard/documents" className="mt-4 inline-block">
              <Button size="sm" variant="outline" className="bg-transparent">
                View All
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Latest vehicles added to your fleet</p>
            <Link href="/dashboard/fleet" className="mt-4 inline-block">
              <Button size="sm" variant="outline" className="bg-transparent">
                View All
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
