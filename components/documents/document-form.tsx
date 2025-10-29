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

interface DocumentFormProps {
  userId: string
  initialData?: {
    id: string
    title: string
    document_type: string
    issue_date: string | null
    expiry_date: string | null
    description: string | null
  }
}

export default function DocumentForm({ userId, initialData }: DocumentFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [documentType, setDocumentType] = useState(initialData?.document_type || "")
  const [issueDate, setIssueDate] = useState(initialData?.issue_date || "")
  const [expiryDate, setExpiryDate] = useState(initialData?.expiry_date || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (initialData) {
        const { error: updateError } = await supabase
          .from("documents")
          .update({
            title,
            document_type: documentType,
            issue_date: issueDate || null,
            expiry_date: expiryDate || null,
            description: description || null,
          })
          .eq("id", initialData.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase.from("documents").insert({
          user_id: userId,
          title,
          document_type: documentType,
          issue_date: issueDate || null,
          expiry_date: expiryDate || null,
          description: description || null,
          status: "active",
        })

        if (insertError) throw insertError
      }

      router.push("/dashboard/documents")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save document")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Details</CardTitle>
        <CardDescription>Enter the information about your document</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="title">Document Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Vehicle License"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Document Type *</Label>
            <Select value={documentType} onValueChange={setDocumentType} required>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="license">License</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="registration">Registration</SelectItem>
                <SelectItem value="permit">Permit</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input id="issueDate" type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input id="expiryDate" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Additional notes about this document"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : initialData ? "Update Document" : "Create Document"}
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
