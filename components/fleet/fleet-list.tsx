"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Search, Truck } from "lucide-react"
import Link from "next/link"

interface Vehicle {
  id: string
  registration_number: string
  vehicle_type: string
  make: string
  model: string
  year: number | null
  license_plate: string | null
  status: string
  created_at: string
}

export default function FleetList({ vehicles }: { vehicles: Vehicle[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.registration_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || vehicle.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      truck: "Truck",
      van: "Van",
      car: "Car",
      bus: "Bus",
      other: "Other",
    }
    return labels[type] || type
  }

  if (filteredVehicles.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Truck className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg">No vehicles found</p>
          <p className="text-muted-foreground text-sm">Start by adding your first vehicle</p>
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
            placeholder="Search by registration, make, or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-md transition-shadow flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </CardTitle>
                  <CardDescription className="mt-1">{vehicle.registration_number}</CardDescription>
                </div>
                <Badge className={getStatusColor(vehicle.status)}>{vehicle.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium">{getTypeLabel(vehicle.vehicle_type)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">License Plate</p>
                  <p className="font-medium">{vehicle.license_plate || "N/A"}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-auto">
                <Link href={`/dashboard/fleet/${vehicle.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    View Details
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link href={`/dashboard/fleet/${vehicle.id}/edit`}>Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/dashboard/fleet/${vehicle.id}/maintenance`}>Add Maintenance</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
