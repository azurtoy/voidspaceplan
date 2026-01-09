import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          try {
            console.log(`🍪 Setting ${cookiesToSet.length} cookies...`);
            cookiesToSet.forEach(({ name, value, options }) => {
              console.log(`  - Setting cookie: ${name}`);
              cookieStore.set(name, value, options);
            });
            console.log('✅ All cookies set successfully');
          } catch (error: any) {
            console.error('❌ Failed to set cookies:', error.message);
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
