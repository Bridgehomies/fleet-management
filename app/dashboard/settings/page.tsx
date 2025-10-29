import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user.email || ""} disabled className="bg-muted" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" type="text" placeholder="Your full name" defaultValue={profile?.full_name || ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company">Company Name</Label>
            <Input id="company" type="text" placeholder="Your company" defaultValue={profile?.company_name || ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" placeholder="Your phone number" defaultValue={profile?.phone || ""} />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Control how you receive alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive alerts via email</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Document Expiry Alerts</p>
              <p className="text-sm text-muted-foreground">Get notified before documents expire</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Maintenance Reminders</p>
              <p className="text-sm text-muted-foreground">Get notified about scheduled maintenance</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  )
}
