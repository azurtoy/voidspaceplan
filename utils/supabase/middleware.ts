import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          // 1. 먼저 request.cookies에 심어서 다음 요청에서 읽을 수 있도록 함
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          
          // 2. 응답 객체를 새로 생성하여 업데이트된 request를 반영
          supabaseResponse = NextResponse.next({ request });
          
          // 3. 브라우저 응답에도 쿠키를 설정
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    console.log('✅ Middleware: User authenticated -', user.email);
  } else {
    console.log('⚠️ Middleware: No user session found');
  }

  return { user, supabaseResponse };
}