// import type React from "react"
// import type { Metadata } from "next"
// import { Geist, Geist_Mono } from "next/font/google"
// import { Analytics } from "@vercel/analytics/next"
// import "./globals.css"

// const geistSans = Geist({ subsets: ["latin"] })
// const geistMono = Geist_Mono({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "Transvoy - Document & Fleet Management",
//   description: "Cloud-based document and fleet management system",
//     generator: 'v0.app'
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={`${geistSans.className} antialiased`}>
//         {children}
//         <Analytics />
//       </body>
//     </html>
//   )
// }

import type React from "react"
import Sidebar from "@/components/layout/sidebar"
import Header from "@/components/layout/header"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const mockUser = { id: "dev-user", email: "dev@test.com" }
  const mockProfile = { id: "dev-user", full_name: "Dev User" }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={mockUser as any} profile={mockProfile as any} />
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
