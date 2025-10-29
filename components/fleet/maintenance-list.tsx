"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface MaintenanceRecord {
  id: string
  maintenance_type: string
  description: string | null
  cost: number | null
  maintenance_date: string
  next_due_date: string | null
  status: string
  notes: string | null
}

export default function MaintenanceList({
  records,
  vehicleId,
}: {
  records: MaintenanceRecord[]
  vehicleId: string
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      oil_change: "Oil Change",
      inspection: "Inspection",
      repair: "Repair",
      service: "Service",
      other: "Other",
    }
    return labels[type] || type
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No maintenance records yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <Card key={record.id} className="hover:shadow-sm transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{getTypeLabel(record.maintenance_type)}</h3>
                  <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{record.description}</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">{format(new Date(record.maintenance_date), "MMM dd, yyyy")}</p>
                  </div>
                  {record.next_due_date && (
                    <div>
                      <p className="text-muted-foreground">Next Due</p>
                      <p className="font-medium">{format(new Date(record.next_due_date), "MMM dd, yyyy")}</p>
                    </div>
                  )}
                  {record.cost && (
                    <div>
                      <p className="text-muted-foreground">Cost</p>
                      <p className="font-medium">${record.cost.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
