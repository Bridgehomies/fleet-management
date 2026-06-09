// import { createServerClient } from "@supabase/ssr"
// import { cookies } from "next/headers"

// export async function createClient() {
//   const cookieStore = await cookies()

//   return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
//     cookies: {
//       getAll() {
//         return cookieStore.getAll()
//       },
//       setAll(cookiesToSet) {
//         try {
//           cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
//         } catch {
//           // The `setAll` method was called from a Server Component.
//           // This can be ignored if you have middleware refreshing
//           // user sessions.
//         }
//       },
//     },
//   })
// }

export async function createClient() {
  const mockUser = { id: "dev-user", email: "dev@test.com", role: "authenticated" }

  return {
    auth: {
      getUser: async () => ({ data: { user: mockUser }, error: null }),
      getSession: async () => ({ data: { session: { user: mockUser } }, error: null }),
    },
    from: (table: string) => ({
      select: (...args: any[]) => ({
        eq: (...args: any[]) => ({
          eq: (...args: any[]) => ({
            single: async () => ({ data: null, error: null }),
            maybeSingle: async () => ({ data: null, error: null }),
          }),
          single: async () => ({ data: null, error: null }),
          maybeSingle: async () => ({ data: null, error: null }),
          not: (...args: any[]) => ({ data: [], error: null }),
          order: (...args: any[]) => ({ data: [], error: null }),
        }),
        not: (...args: any[]) => ({
          eq: (...args: any[]) => ({ data: [], error: null }),
        }),
        order: (...args: any[]) => ({
          eq: (...args: any[]) => ({ data: [], error: null }),
          data: [], error: null,
        }),
        single: async () => ({ data: null, error: null }),
        data: [], error: null,
      }),
      insert: (...args: any[]) => ({ data: null, error: null }),
      update: (...args: any[]) => ({
        eq: (...args: any[]) => ({ data: null, error: null }),
      }),
      delete: (...args: any[]) => ({
        eq: (...args: any[]) => ({ data: null, error: null }),
      }),
    }),
  } as any
}
