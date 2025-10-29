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

interface VehicleFormProps {
  userId: string
}

export default function VehicleForm({ userId }: VehicleFormProps) {
  const [registrationNumber, setRegistrationNumber] = useState("")
  const [vehicleType, setVehicleType] = useState("")
  const [make, setMake] = useState("")
  const [model, setModel] = useState("")
  const [year, setYear] = useState("")
  const [vin, setVin] = useState("")
  const [licensePlate, setLicensePlate] = useState("")
  const [purchaseDate, setPurchaseDate] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error: insertError } = await supabase.from("vehicles").insert({
        user_id: userId,
        registration_number: registrationNumber,
        vehicle_type: vehicleType,
        make,
        model,
        year: year ? Number.parseInt(year) : null,
        vin: vin || null,
        license_plate: licensePlate || null,
        purchase_date: purchaseDate || null,
        status: "active",
      })

      if (insertError) throw insertError

      router.push("/dashboard/fleet")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create vehicle")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Information</CardTitle>
        <CardDescription>Enter the details of your vehicle</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="registration">Registration Number *</Label>
              <Input
                id="registration"
                placeholder="e.g., ABC-123"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Vehicle Type *</Label>
              <Select value={vehicleType} onValueChange={setVehicleType} required>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="bus">Bus</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="make">Make *</Label>
              <Input
                id="make"
                placeholder="e.g., Toyota"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                placeholder="e.g., Hiace"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                placeholder="e.g., 2023"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="licensePlate">License Plate</Label>
              <Input
                id="licensePlate"
                placeholder="e.g., ABC 123"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="vin">VIN</Label>
              <Input
                id="vin"
                placeholder="Vehicle Identification Number"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Add Vehicle"}
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
