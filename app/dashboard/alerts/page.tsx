import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AlertsList from "@/components/alerts/alerts-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AlertsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: alerts } = await supabase
    .from("expiry_alerts")
    .select("*")
    .eq("user_id", user.id)
    .order("expiry_date", { ascending: true })

  const unacknowledgedCount = alerts?.filter((a) => !a.is_acknowledged).length || 0
  const criticalCount =
    alerts?.filter((a) => {
      const daysUntilExpiry = Math.ceil(
        (new Date(a.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
      )
      return daysUntilExpiry <= 7 && !a.is_acknowledged
    }).length || 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alerts & Notifications</h1>
        <p className="text-muted-foreground mt-2">Track upcoming expiries and maintenance schedules</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Active notifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Unacknowledged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{unacknowledgedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Critical (7 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Expiring soon</p>
          </CardContent>
        </Card>
      </div>

      <AlertsList alerts={alerts || []} />
    </div>
  )
}
