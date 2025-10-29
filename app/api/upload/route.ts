import { createClient } from "@/lib/supabase/server"
import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const documentId = formData.get("documentId") as string
    const vehicleId = formData.get("vehicleId") as string | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(`documents/${user.id}/${Date.now()}-${file.name}`, file, {
      access: "private",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    // Save attachment record to database
    const { error: dbError } = await supabase.from("document_attachments").insert({
      document_id: documentId,
      vehicle_id: vehicleId || null,
      file_url: blob.url,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      uploaded_by: user.id,
    })

    if (dbError) throw dbError

    return NextResponse.json({
      success: true,
      file: {
        url: blob.url,
        name: file.name,
        size: file.size,
      },
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
