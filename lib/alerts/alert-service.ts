import { createClient } from "@/lib/supabase/server"
import { addDays } from "date-fns"

export async function generateExpiryAlerts() {
  const supabase = await createClient()

  // Get all documents with expiry dates
  const { data: documents } = await supabase
    .from("documents")
    .select("id, user_id, title, expiry_date")
    .not("expiry_date", "is", null)

  if (!documents) return

  const alertDays = [7, 14, 30] // Alert 7, 14, and 30 days before expiry

  for (const doc of documents) {
    const expiryDate = new Date(doc.expiry_date)

    for (const days of alertDays) {
      const alertDate = addDays(expiryDate, -days)

      // Check if alert already exists
      const { data: existingAlert } = await supabase
        .from("expiry_alerts")
        .select("id")
        .eq("document_id", doc.id)
        .eq("alert_type", "document_expiry")
        .eq("alert_date", alertDate.toISOString().split("T")[0])
        .single()

      if (!existingAlert) {
        // Create new alert
        await supabase.from("expiry_alerts").insert({
          user_id: doc.user_id,
          document_id: doc.id,
          alert_type: "document_expiry",
          title: `Document "${doc.title}" expiring soon`,
          description: `Your document will expire on ${expiryDate.toLocaleDateString()}`,
          expiry_date: doc.expiry_date,
          alert_date: alertDate.toISOString().split("T")[0],
          is_sent: false,
        })
      }
    }
  }

  // Get all maintenance records with next due dates
  const { data: maintenanceRecords } = await supabase
    .from("maintenance_records")
    .select("id, user_id, vehicle_id, maintenance_type, next_due_date")
    .not("next_due_date", "is", null)

  if (!maintenanceRecords) return

  for (const record of maintenanceRecords) {
    const dueDate = new Date(record.next_due_date)

    for (const days of alertDays) {
      const alertDate = addDays(dueDate, -days)

      const { data: existingAlert } = await supabase
        .from("expiry_alerts")
        .select("id")
        .eq("maintenance_record_id", record.id)
        .eq("alert_type", "maintenance_due")
        .eq("alert_date", alertDate.toISOString().split("T")[0])
        .single()

      if (!existingAlert) {
        await supabase.from("expiry_alerts").insert({
          user_id: record.user_id,
          vehicle_id: record.vehicle_id,
          alert_type: "maintenance_due",
          title: `Maintenance due for vehicle`,
          description: `${record.maintenance_type} maintenance is due on ${dueDate.toLocaleDateString()}`,
          expiry_date: record.next_due_date,
          alert_date: alertDate.toISOString().split("T")[0],
          is_sent: false,
        })
      }
    }
  }
}
