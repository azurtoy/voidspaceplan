import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export default async function proxy(request: NextRequest) {
  try {
    // 정적 파일 필터링 가드: _next, favicon.ico, 이미지, 폰트 파일은 인증 로직을 타지 않음
    const { pathname } = request.nextUrl;
    const isStaticFile = 
      pathname.startsWith('/_next') ||
      pathname === '/favicon.ico' ||
      /\.(png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|eot|otf)$/i.test(pathname);
    
    if (isStaticFile) {
      return NextResponse.next();
    }
    
    // 환경 변수 강제 확인
    console.log('🔗 URL Check:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'OK' : 'MISSING');
    
    // 쿠키 디버깅: 서버에 도착한 쿠키 명단 확인 (안전하게)
    if (request?.cookies) {
      try {
        const cookieNames = request.cookies.getAll().map(c => c.name);
        console.log('🍪 Cookie Names:', cookieNames);
      } catch (e) {
        console.log('⚠️ Failed to get cookie names:', e);
      }
    }
    
    // 1. 세션 업데이트 로직을 proxy.ts 내부에서 직접 구현
    let supabaseResponse = NextResponse.next({
      request,
    });

    let supabase: any;
    try {
      supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              try {
                if (!request?.cookies) {
                  return [];
                }
                return request.cookies.getAll();
              } catch (e) {
                console.error('❌ Error in getAll():', e);
                return [];
              }
            },
            setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
              try {
                // 서버와 브라우저의 쿠키를 강제로 동기화
                if (request?.cookies) {
                  cookiesToSet.forEach(({ name, value }) => {
                    // request.cookies에 먼저 설정
                    request.cookies.set(name, value);
                  });
                }
                
                // 응답 객체를 새로 생성하여 업데이트된 request를 반영
                supabaseResponse = NextResponse.next({ request });
                
                // 브라우저 응답에도 쿠키 설정
                // 개발 환경(localhost)에서는 secure: false, sameSite: 'lax' 명시적 설정
                // path: '/'를 명시하여 모든 경로에서 쿠키가 유효하도록 보장
                cookiesToSet.forEach(({ name, value, options }) => {
                  supabaseResponse.cookies.set(name, value, {
                    ...options,
                    path: '/', // 명시적 설정으로 /station 경로에서도 유효
                    secure: false, // localhost에서는 false
                    sameSite: 'lax', // 명시적 설정
                  });
                });
              } catch (e) {
                console.error('❌ Error in setAll():', e);
              }
            },
          },
        }
      );
    } catch (e) {
      console.error('❌ Failed to create Supabase client:', e);
      return NextResponse.next({ request });
    }

    // 2. 수동 세션 복구: getUser() 호출 전에 쿠키에서 직접 토큰 추출 및 세션 주입
    // 쿠키 이름 직접 정의 (로그에서 확인한 이름)
    const COOKIE_NAME = 'sb-rpuvtpmibsmaknfjrnml-auth-token';
    
    // 안전하게 쿠키 가져오기 (request.cookies가 없을 경우 대비)
    const cookie = request?.cookies?.get(COOKIE_NAME);
    
    // 쿠키 이름이 감지되었을 때만 작동하도록 조건문
    if (cookie?.value) {
      console.log('🍪 Manual Check: Found cookie value, length:', cookie.value.length);
      
      try {
        // Supabase SSR 쿠키는 보통 JSON 형태입니다.
        const authData = JSON.parse(decodeURIComponent(cookie.value));
        if (authData && authData.access_token) {
          console.log('🔧 Attempting manual session injection from cookie...');
          
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: authData.access_token,
            refresh_token: authData.refresh_token || '',
          });
          
          if (sessionError) {
            console.error('❌ Manual session injection failed:', sessionError.message);
          } else {
            console.log('✅ Manual session injection successful');
            if (sessionData?.session) {
              console.log('   Session user:', sessionData.session.user?.email);
            }
          }
        }
      } catch (e) {
        // 단순 문자열일 경우를 대비한 2차 시도
        console.log('⚠️ JSON parse failed, trying as plain string...');
        try {
          await supabase.auth.setSession({
            access_token: cookie.value,
            refresh_token: '',
          });
          console.log('✅ Manual session injection successful (plain string)');
        } catch (e2) {
          console.error('❌ Cookie Parse Error (both attempts failed):', e2);
          console.log('🍪 Raw cookie value (first 100 chars):', cookie.value.substring(0, 100));
        }
      }
    } else {
      console.log('⚠️ Auth token cookie not found or has no value');
    }

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    let user: any = null;
    let authError: any = null;
    
    try {
      const result = await supabase.auth.getUser();
      user = result.data?.user;
      authError = result.error;
    } catch (e) {
      console.error('❌ Failed to call getUser():', e);
      authError = { message: String(e) };
    }
    
    // getUser()가 실패했지만 쿠키 값이 있다면 setSession을 통해 서버 사이드 세션 강제 복구
    if (authError && cookie?.value) {
      console.log('🔧 getUser() failed but cookie exists, attempting session recovery...');
      try {
        const authData = JSON.parse(decodeURIComponent(cookie.value));
        if (authData && authData.access_token) {
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: authData.access_token,
            refresh_token: authData.refresh_token || '',
          });
          
          if (!sessionError && sessionData?.session) {
            // 세션 복구 성공 시 user 업데이트
            user = sessionData.session.user;
            console.log('✅ Session recovery successful after getUser() failure');
            console.log('   Session user:', user?.email);
          } else {
            console.error('❌ Session recovery failed:', sessionError?.message);
          }
        }
      } catch (e) {
        console.error('❌ Session recovery parse error:', e);
      }
    }
    
    // 에러 로깅 강화 - 상세 정보 출력
    if (authError) {
      console.error('❌ AUTH_SYSTEM_ERROR:', authError.message);
      try {
        console.error('❌ AUTH_SYSTEM_DETAILS:', JSON.stringify(authError, null, 2));
      } catch (e) {
        console.error('❌ AUTH_SYSTEM_DETAILS: [Failed to stringify]');
      }
      
      // "Auth session missing!" 에러 시 수동 세션 설정 시도
      if (authError.message?.includes('Auth session missing!')) {
        console.log('🔧 Attempting manual session recovery...');
        
        // Supabase 인증 쿠키 찾기 (안전하게)
        if (request?.cookies) {
          try {
            const allCookies = request.cookies.getAll();
            const authCookies = allCookies.filter(cookie => 
              cookie.name.includes('auth-token') || cookie.name.includes('supabase-auth')
            );
            
            console.log('🍪 Found auth cookies:', authCookies.map(c => ({ name: c.name, hasValue: !!c.value })));
            
            // access_token과 refresh_token을 찾아서 수동으로 세션 설정 시도
            const accessTokenCookie = allCookies.find(c => c.name.includes('access_token') || c.name.includes('auth-token'));
            const refreshTokenCookie = allCookies.find(c => c.name.includes('refresh_token'));
            
            if (accessTokenCookie && refreshTokenCookie) {
              try {
                const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                  access_token: accessTokenCookie.value,
                  refresh_token: refreshTokenCookie.value,
                });
                
                if (sessionError) {
                  console.error('❌ Manual session recovery failed:', sessionError.message);
                } else {
                  console.log('✅ Manual session recovery successful');
                  // 세션 복구 성공 시 user 업데이트
                  if (sessionData?.session) {
                    user = sessionData.session.user;
                  }
                }
              } catch (e) {
                console.error('❌ Manual session recovery exception:', e);
              }
            } else {
              console.log('⚠️ Access token or refresh token cookie not found');
            }
          } catch (e) {
            console.error('❌ Failed to get cookies for recovery:', e);
          }
        } else {
          console.log('⚠️ Request cookies not available');
        }
      }
      
      // "JWT expired" 에러 시 브라우저 시간 확인 안내
      if (authError.message?.includes('JWT expired')) {
        console.error('⚠️ JWT EXPIRED ERROR DETECTED');
        console.error('⚠️ Please check if your browser/system time is synchronized with the current time');
        console.error('⚠️ JWT tokens are time-sensitive and require accurate system clock');
      }
      
      // Invalid signature 에러는 환경 변수 문제일 수 있음
      if (authError.message?.includes('Invalid signature')) {
        console.error('⚠️ Possible environment variable issue - check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
      }
    }

    // pathname은 이미 위에서 추출했으므로 재사용

    // 터미널 로그는 그대로 유지
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 PROXY:', pathname);
    console.log('   User:', user ? user.email : 'NOT AUTHENTICATED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (user) {
      console.log('✅ Middleware: User authenticated -', user.email);
    } else {
      console.log('⚠️ Middleware: No user session found');
    }

    // 2. [핵심] 비로그인 유저가 스테이션 진입 시 차단
    if (!user && pathname.startsWith('/station')) {
      try {
        const redirectResponse = NextResponse.redirect(new URL('/', request.url));
        
        // supabaseResponse의 모든 쿠키를 단 하나도 빠짐없이 복사
        // Supabase 세션 유지를 위해 모든 속성을 하드코딩하여 유실 방지
        try {
          supabaseResponse.cookies.getAll().forEach((cookie) => {
            try {
              redirectResponse.cookies.set(cookie.name, cookie.value, {
                path: '/', // 명시적 설정
                maxAge: 60 * 60 * 24 * 7, // 7일 (Supabase 기본값)
                sameSite: 'lax', // 명시적 설정
                secure: false, // localhost에서는 false
                httpOnly: cookie.httpOnly !== undefined ? cookie.httpOnly : true, // httpOnly 유지
                ...cookie, // 기타 속성 유지
              });
            } catch (e) {
              console.error('❌ Failed to set cookie:', cookie.name, e);
            }
          });
        } catch (e) {
          console.error('❌ Failed to copy cookies:', e);
        }
        
        // supabaseResponse의 모든 헤더를 완벽하게 복사
        // Set-Cookie 헤더는 여러 개일 수 있으므로 append 사용
        try {
          supabaseResponse.headers.forEach((value, key) => {
            try {
              redirectResponse.headers.append(key, value);
            } catch (e) {
              console.error('❌ Failed to append header:', key, e);
            }
          });
        } catch (e) {
          console.error('❌ Failed to copy headers:', e);
        }
        
        return redirectResponse;
      } catch (e) {
        console.error('❌ Failed to create redirect response:', e);
        return supabaseResponse;
      }
    }

    // 3. 이미 로그인된 유저가 로그인 페이지 진입 시 자동으로 스테이션 이동
    if (user && pathname === '/') {
      try {
        const redirectResponse = NextResponse.redirect(new URL('/station', request.url));
        
        // supabaseResponse의 모든 쿠키를 단 하나도 빠짐없이 복사
        // Supabase 세션 유지를 위해 모든 속성을 하드코딩하여 유실 방지
        try {
          supabaseResponse.cookies.getAll().forEach((cookie) => {
            try {
              redirectResponse.cookies.set(cookie.name, cookie.value, {
                path: '/', // 명시적 설정
                maxAge: 60 * 60 * 24 * 7, // 7일 (Supabase 기본값)
                sameSite: 'lax', // 명시적 설정
                secure: false, // localhost에서는 false
                httpOnly: cookie.httpOnly !== undefined ? cookie.httpOnly : true, // httpOnly 유지
                ...cookie, // 기타 속성 유지
              });
            } catch (e) {
              console.error('❌ Failed to set cookie:', cookie.name, e);
            }
          });
        } catch (e) {
          console.error('❌ Failed to copy cookies:', e);
        }
        
        // supabaseResponse의 모든 헤더를 완벽하게 복사
        // Set-Cookie 헤더는 여러 개일 수 있으므로 append 사용
        try {
          supabaseResponse.headers.forEach((value, key) => {
            try {
              redirectResponse.headers.append(key, value);
            } catch (e) {
              console.error('❌ Failed to append header:', key, e);
            }
          });
        } catch (e) {
          console.error('❌ Failed to copy headers:', e);
        }
        
        return redirectResponse;
      } catch (e) {
        console.error('❌ Failed to create redirect response:', e);
        return supabaseResponse;
      }
    }

    return supabaseResponse;
  } catch (error: any) {
    // 전체 함수 레벨 에러 처리 - 최후의 안전망
    console.error('❌ CRITICAL ERROR in proxy.ts:', error?.message || error);
    console.error('❌ Stack trace:', error?.stack);
    
    // 에러가 발생해도 기본 응답은 반환하여 서비스 중단 방지
    try {
      return NextResponse.next({ request });
    } catch (e) {
      console.error('❌ Failed to create fallback response:', e);
      // 최후의 수단: 빈 응답 반환
      return new NextResponse(null, { status: 500 });
    }
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
