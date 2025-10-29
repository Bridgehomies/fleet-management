import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DocumentsList from "@/components/documents/documents-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function DocumentsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground mt-2">Manage and track all your important documents</p>
        </div>
        <Link href="/dashboard/documents/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Document
          </Button>
        </Link>
      </div>

      <DocumentsList documents={documents || []} />
    </div>
  )
}
