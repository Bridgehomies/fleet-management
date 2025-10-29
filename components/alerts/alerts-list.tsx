"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { createClient } from "@/lib/supabase/client"

interface Alert {
  id: string
  alert_type: string
  title: string
  description: string | null
  expiry_date: string
  is_acknowledged: boolean
  acknowledged_at: string | null
}

export default function AlertsList({ alerts }: { alerts: Alert[] }) {
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(
    new Set(alerts.filter((a) => a.is_acknowledged).map((a) => a.id)),
  )
  const supabase = createClient()

  const handleAcknowledge = async (alertId: string) => {
    try {
      await supabase
        .from("expiry_alerts")
        .update({
          is_acknowledged: true,
          acknowledged_at: new Date().toISOString(),
        })
        .eq("id", alertId)

      setAcknowledgedAlerts((prev) => new Set([...prev, alertId]))
    } catch (error) {
      console.error("Failed to acknowledge alert:", error)
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "document_expiry":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "maintenance_due":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "inspection_due":
        return <Clock className="h-5 w-5 text-blue-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getAlertColor = (daysUntilExpiry: number, isAcknowledged: boolean) => {
    if (isAcknowledged) return "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
    if (daysUntilExpiry <= 0) return "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
    if (daysUntilExpiry <= 7) return "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800"
    if (daysUntilExpiry <= 30) return "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800"
    return "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
  }

  const getUrgencyBadge = (daysUntilExpiry: number, isAcknowledged: boolean) => {
    if (isAcknowledged) return <Badge variant="outline">Acknowledged</Badge>
    if (daysUntilExpiry <= 0) return <Badge className="bg-red-600">Expired</Badge>
    if (daysUntilExpiry <= 7) return <Badge className="bg-orange-600">Critical</Badge>
    if (daysUntilExpiry <= 30) return <Badge className="bg-yellow-600">Warning</Badge>
    return <Badge className="bg-blue-600">Upcoming</Badge>
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
          <p className="text-muted-foreground text-lg">No alerts</p>
          <p className="text-muted-foreground text-sm">All your documents and maintenance are up to date</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const daysUntilExpiry = differenceInDays(new Date(alert.expiry_date), new Date())
        const isAcknowledged = acknowledgedAlerts.has(alert.id)

        return (
          <Card key={alert.id} className={`border-2 ${getAlertColor(daysUntilExpiry, isAcknowledged)}`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="mt-1">{getAlertIcon(alert.alert_type)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-semibold">{alert.title}</h3>
                      {alert.description && <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>}
                    </div>
                    {getUrgencyBadge(daysUntilExpiry, isAcknowledged)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                    <span>Expiry: {format(new Date(alert.expiry_date), "MMM dd, yyyy")}</span>
                    <span>
                      {daysUntilExpiry < 0
                        ? `Expired ${Math.abs(daysUntilExpiry)} days ago`
                        : `${daysUntilExpiry} days remaining`}
                    </span>
                  </div>
                  {!isAcknowledged && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3 bg-transparent"
                      onClick={() => handleAcknowledge(alert.id)}
                    >
                      Mark as Acknowledged
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
