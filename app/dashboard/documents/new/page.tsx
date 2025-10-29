import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DocumentForm from "@/components/documents/document-form"

export default async function NewDocumentPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Add New Document</h1>
        <p className="text-muted-foreground mt-2">Upload and track a new document</p>
      </div>
      <DocumentForm userId={user.id} />
    </div>
  )
}
