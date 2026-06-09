export function createClient() {
  const mockUser = { id: "dev-user", email: "dev@test.com", role: "authenticated" }

  return {
    auth: {
      getUser: async () => ({ data: { user: mockUser }, error: null }),
      getSession: async () => ({ data: { session: { user: mockUser } }, error: null }),
      signInWithPassword: async () => ({ data: { user: mockUser }, error: null }),
      signUp: async () => ({ data: { user: mockUser }, error: null }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
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
          order: (...args: any[]) => ({ data: [], error: null }),
        }),
        order: (...args: any[]) => ({ data: [], error: null }),
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
