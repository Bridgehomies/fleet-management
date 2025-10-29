"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

interface TransactionFormProps {
  userId: string
  vehicles: Array<{ id: string; make: string; model: string; registration_number: string }>
}

export default function TransactionForm({ userId, vehicles }: TransactionFormProps) {
  const [transactionType, setTransactionType] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split("T")[0])
  const [paymentMethod, setPaymentMethod] = useState("")
  const [referenceNumber, setReferenceNumber] = useState("")
  const [vehicleId, setVehicleId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error: insertError } = await supabase.from("accounting_transactions").insert({
        user_id: userId,
        vehicle_id: vehicleId || null,
        transaction_type: transactionType,
        amount: Number.parseFloat(amount),
        description: description || null,
        category: category || null,
        transaction_date: transactionDate,
        payment_method: paymentMethod || null,
        reference_number: referenceNumber || null,
        synced_to_accounting: false,
      })

      if (insertError) throw insertError

      router.push("/dashboard/accounting")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create transaction")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Details</CardTitle>
        <CardDescription>Record a new financial transaction</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Transaction Type *</Label>
              <Select value={transactionType} onValueChange={setTransactionType} required>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="fuel">Fuel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g., Oil change for vehicle ABC-123"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="fuel">Fuel</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="registration">Registration</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Transaction Date *</Label>
              <Input
                id="date"
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reference">Reference Number</Label>
              <Input
                id="reference"
                placeholder="e.g., INV-001"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="vehicle">Related Vehicle</Label>
            <Select value={vehicleId} onValueChange={setVehicleId}>
              <SelectTrigger id="vehicle">
                <SelectValue placeholder="Select vehicle (optional)" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.make} {vehicle.model} ({vehicle.registration_number})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Add Transaction"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
