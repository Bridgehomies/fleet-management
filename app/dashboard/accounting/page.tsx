import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import TransactionsList from "@/components/accounting/transactions-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AccountingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: transactions } = await supabase
    .from("accounting_transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("transaction_date", { ascending: false })

  // Calculate totals
  const totalExpenses =
    transactions?.filter((t) => t.transaction_type === "expense").reduce((sum, t) => sum + (t.amount || 0), 0) || 0

  const totalIncome =
    transactions?.filter((t) => t.transaction_type === "income").reduce((sum, t) => sum + (t.amount || 0), 0) || 0

  const maintenanceCosts =
    transactions?.filter((t) => t.transaction_type === "maintenance").reduce((sum, t) => sum + (t.amount || 0), 0) || 0

  const fuelCosts =
    transactions?.filter((t) => t.transaction_type === "fuel").reduce((sum, t) => sum + (t.amount || 0), 0) || 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounting</h1>
          <p className="text-muted-foreground mt-2">Track financial transactions and expenses</p>
        </div>
        <Link href="/dashboard/accounting/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Transaction
          </Button>
        </Link>
      </div>

      {/* Financial Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">All income transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">All expense transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Maintenance Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${maintenanceCosts.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Fleet maintenance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Fuel Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${fuelCosts.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Fuel expenses</p>
          </CardContent>
        </Card>
      </div>

      <TransactionsList transactions={transactions || []} />
    </div>
  )
}
