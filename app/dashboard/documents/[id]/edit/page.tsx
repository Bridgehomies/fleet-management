import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FileUpload from "@/components/upload/file-upload"
import DocumentForm from "@/components/documents/document-form"

export default async function EditDocumentPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: document } = await supabase
    .from("documents")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single()

  if (!document) {
    redirect("/dashboard/documents")
  }

  const { data: attachments } = await supabase.from("document_attachments").select("*").eq("document_id", params.id)

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Document</h1>
        <p className="text-muted-foreground mt-2">{document.title}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <DocumentForm userId={user.id} initialData={document} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload documentId={params.id} />
            </CardContent>
          </Card>

          {attachments && attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors"
                    >
                      <span className="text-sm truncate">{attachment.file_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {(attachment.file_size / 1024).toFixed(2)} KB
                      </span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
