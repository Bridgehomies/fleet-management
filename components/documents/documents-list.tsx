"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Search, Download, Trash2 } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface Document {
  id: string
  title: string
  document_type: string
  expiry_date: string | null
  issue_date: string | null
  status: string
  file_url: string | null
  created_at: string
}

export default function DocumentsList({ documents }: { documents: Document[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string | null>(null)

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !filterType || doc.document_type === filterType
    return matchesSearch && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "expiring_soon":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      license: "License",
      insurance: "Insurance",
      registration: "Registration",
      permit: "Permit",
      other: "Other",
    }
    return labels[type] || type
  }

  if (filteredDocuments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground text-lg">No documents found</p>
          <p className="text-muted-foreground text-sm">Start by adding your first document</p>
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
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{doc.title}</CardTitle>
                  <CardDescription className="mt-1">Type: {getTypeLabel(doc.document_type)}</CardDescription>
                </div>
                <Badge className={getStatusColor(doc.status)}>{doc.status.replace("_", " ")}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                {doc.issue_date && (
                  <div>
                    <p className="text-muted-foreground">Issue Date</p>
                    <p className="font-medium">{format(new Date(doc.issue_date), "MMM dd, yyyy")}</p>
                  </div>
                )}
                {doc.expiry_date && (
                  <div>
                    <p className="text-muted-foreground">Expiry Date</p>
                    <p className="font-medium">{format(new Date(doc.expiry_date), "MMM dd, yyyy")}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {doc.file_url && (
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                )}
                <Link href={`/dashboard/documents/${doc.id}`}>
                  <Button variant="outline" size="sm">
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
                      <Link href={`/dashboard/documents/${doc.id}/edit`}>Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
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
