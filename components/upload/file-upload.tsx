"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, File, Loader2 } from "lucide-react"

interface FileUploadProps {
  documentId: string
  vehicleId?: string
  onUploadComplete?: (file: { url: string; name: string; size: number }) => void
}

export default function FileUpload({ documentId, vehicleId, onUploadComplete }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ url: string; name: string; size: number }>>([])
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  const handleFiles = async (files: File[]) => {
    setError(null)
    setIsUploading(true)

    for (const file of files) {
      try {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("documentId", documentId)
        if (vehicleId) {
          formData.append("vehicleId", vehicleId)
        }

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Upload failed")
        }

        const data = await response.json()
        setUploadedFiles((prev) => [...prev, data.file])
        onUploadComplete?.(data.file)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed")
      }
    }

    setIsUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className="space-y-4">
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-border"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium">Drag and drop your files here</p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-transparent"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Select Files"
              )}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
            />
            <p className="text-xs text-muted-foreground">Max 50MB per file</p>
          </div>
        </CardContent>
      </Card>

      {error && <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>}

      {uploadedFiles.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Uploaded Files</h3>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <File className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
