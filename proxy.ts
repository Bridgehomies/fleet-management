import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Allow auth pages
  if (pathname.startsWith("/auth")) {
    return NextResponse.next()
  }

  // Allow public assets
  if (pathname.startsWith("/_next") || pathname.startsWith("/public")) {
    return NextResponse.next()
  }

  // Redirect root to dashboard
  if (pathname === "/") {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return await updateSession(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
