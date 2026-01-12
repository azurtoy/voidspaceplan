import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // 가장 순수한 기본 형태 - 브라우저가 표준 쿠키 흐름을 타게 함
  // 수동 쿠키 핸들러를 완전히 제거하여 브라우저의 자동 쿠키 관리를 방해하지 않음
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
