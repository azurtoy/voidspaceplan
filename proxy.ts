import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const { user, supabaseResponse } = await updateSession(request);

  // Protect /station and /study routes
  if (request.nextUrl.pathname.startsWith('/station') || request.nextUrl.pathname.startsWith('/study')) {
    if (!user) {
      // Redirect to login if not authenticated
      const redirectUrl = new URL('/', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Additional check for /study routes: verify physics is unlocked
    if (request.nextUrl.pathname.startsWith('/study')) {
      // Create supabase client for profile check
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) => {
                request.cookies.set(name, value);
              });
            },
          },
        }
      );

      // Check if physics is unlocked
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_physics_unlocked')
        .eq('id', user.id)
        .single();

      if (!profile?.is_physics_unlocked) {
        // Redirect to station if physics is not unlocked
        console.log('⚠️ Access denied to /study: Physics not unlocked for user', user.email);
        const redirectUrl = new URL('/station', request.url);
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  // If authenticated user tries to access root, redirect to station
  if (request.nextUrl.pathname === '/' && user) {
    const redirectUrl = new URL('/station', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
