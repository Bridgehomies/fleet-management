import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import TransactionForm from "@/components/accounting/transaction-form"

export default async function NewTransactionPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("id, make, model, registration_number")
    .eq("user_id", user.id)

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Add Transaction</h1>
        <p className="text-muted-foreground mt-2">Record a new financial transaction</p>
      </div>
      <TransactionForm userId={user.id} vehicles={vehicles || []} />
    </div>
  )
}
