"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Search, TrendingDown, TrendingUp } from "lucide-react"
import { format } from "date-fns"

interface Transaction {
  id: string
  transaction_type: string
  amount: number
  description: string | null
  category: string | null
  transaction_date: string
  payment_method: string | null
  reference_number: string | null
  synced_to_accounting: boolean
}

export default function TransactionsList({ transactions }: { transactions: Transaction[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string | null>(null)

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.reference_number?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !filterType || t.transaction_type === filterType
    return matchesSearch && matchesType
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "income":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "expense":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "maintenance":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "fuel":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      income: "Income",
      expense: "Expense",
      maintenance: "Maintenance",
      fuel: "Fuel",
    }
    return labels[type] || type
  }

  const getTypeIcon = (type: string) => {
    return type === "income" || type === "fuel" ? (
      <TrendingUp className="h-4 w-4" />
    ) : (
      <TrendingDown className="h-4 w-4" />
    )
  }

  if (filteredTransactions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground text-lg">No transactions found</p>
          <p className="text-muted-foreground text-sm">Start by adding your first transaction</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredTransactions.map((transaction) => (
          <Card key={transaction.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">{getTypeIcon(transaction.transaction_type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{transaction.description || "Transaction"}</h3>
                      <Badge className={getTypeColor(transaction.transaction_type)}>
                        {getTypeLabel(transaction.transaction_type)}
                      </Badge>
                      {transaction.synced_to_accounting && (
                        <Badge variant="outline" className="text-xs">
                          Synced
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground mt-2">
                      <div>
                        <p className="text-xs">Date</p>
                        <p className="font-medium text-foreground">
                          {format(new Date(transaction.transaction_date), "MMM dd, yyyy")}
                        </p>
                      </div>
                      {transaction.category && (
                        <div>
                          <p className="text-xs">Category</p>
                          <p className="font-medium text-foreground">{transaction.category}</p>
                        </div>
                      )}
                      {transaction.payment_method && (
                        <div>
                          <p className="text-xs">Payment Method</p>
                          <p className="font-medium text-foreground capitalize">{transaction.payment_method}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-lg font-bold ${
                      transaction.transaction_type === "income" || transaction.transaction_type === "fuel"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.transaction_type === "income" || transaction.transaction_type === "fuel" ? "+" : "-"}$
                    {transaction.amount.toFixed(2)}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="mt-2">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Sync to Accounting</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
