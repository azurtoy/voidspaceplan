# 📘 Supabase 데이터베이스 설정 가이드

## 🎯 개요
이 가이드는 VOID - Physics II 플랫폼의 Supabase 데이터베이스를 처음부터 설정하는 방법을 단계별로 설명합니다.

---

## 📋 준비물
- ✅ Supabase 계정 (https://supabase.com)
- ✅ 프로젝트가 이미 생성되어 있어야 함
- ✅ `supabase_schema.sql` 파일 (이미 생성됨)

---

## 🚀 Step-by-Step 설정 가이드

### **Step 1: Supabase 대시보드 접속**

1. https://supabase.com 에 로그인
2. 본인의 프로젝트 선택 (VOID 프로젝트)
3. 왼쪽 사이드바에서 **SQL Editor** 클릭

---

### **Step 2: 스키마 실행**

1. **SQL Editor**에서 **"New Query"** 버튼 클릭
2. `supabase_schema.sql` 파일을 열어서 **전체 내용 복사**
3. SQL Editor에 **붙여넣기**
4. 오른쪽 하단의 **"RUN"** 버튼 클릭 (또는 `Ctrl + Enter`)
5. ✅ 성공 메시지 확인: `Success. No rows returned`

> ⚠️ **주의**: 에러가 발생하면 메시지를 확인하고 다시 시도하세요. 대부분의 경우 이미 테이블이 존재하거나 권한 문제입니다.

---

### **Step 3: 테이블 확인**

1. 왼쪽 사이드바에서 **"Table Editor"** 클릭
2. 다음 테이블들이 생성되었는지 확인:
   - ✅ `profiles` - 유저 정보
   - ✅ `formulas` - 공식 데이터베이스
   - ✅ `comments` - 댓글/토론
   - ✅ `bookmarks` - 북마크
   - ✅ `search_history` - 검색 기록
   - ✅ `messages` - 채팅/DM
   - ✅ `notifications` - 알림
   - ✅ `progress` - 학습 진도
   - ✅ `votes` - 투표 (Upvote/Downvote)
   - ✅ `signals` - 피드백/에러 리포트

---

### **Step 4: Row Level Security (RLS) 확인**

1. **Table Editor**에서 아무 테이블이나 선택 (예: `profiles`)
2. 오른쪽 상단에 **"RLS enabled"** 🔒 아이콘이 있는지 확인
3. 모든 테이블에 RLS가 활성화되어 있어야 함

---

### **Step 5: 이메일 인증 설정 (선택사항)**

Supabase는 기본적으로 이메일 인증을 요구합니다. 개발 중에는 이를 비활성화할 수 있습니다:

1. 왼쪽 사이드바에서 **"Authentication"** 클릭
2. **"Providers"** 탭 선택
3. **"Email"** 클릭
4. **"Confirm email"** 토글을 **OFF**로 설정 (개발용)

> ⚠️ **프로덕션 배포 시**: 이메일 인증을 다시 **ON**으로 설정하세요!

---

### **Step 6: 환경 변수 확인**

프로젝트의 `.env.local` 파일에 다음 변수들이 설정되어 있는지 확인:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**변수 찾는 방법:**
1. Supabase 대시보드에서 **"Settings"** (왼쪽 하단 톱니바퀴)
2. **"API"** 탭 선택
3. **Project URL** 복사 → `NEXT_PUBLIC_SUPABASE_URL`
4. **anon/public key** 복사 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### **Step 7: 관리자 계정 설정**

첫 번째 관리자 계정을 수동으로 설정해야 합니다:

1. 회원가입으로 계정 생성
2. **SQL Editor**로 이동
3. 다음 SQL 실행 (이메일을 본인 이메일로 변경):

```sql
UPDATE public.profiles
SET role = 'admin', is_physics_unlocked = true
WHERE email = 'your-email@gmail.com';
```

4. **"RUN"** 클릭

---

### **Step 8: 샘플 데이터 추가 (선택사항)**

공식(Formulas) 샘플 데이터를 추가하려면:

1. **SQL Editor**로 이동
2. 다음 SQL 실행:

```sql
INSERT INTO public.formulas (chapter_id, chapter_title, category, title, formula, description, tags)
VALUES
  ('15', 'Oscillations', 'Simple Harmonic Motion', 'Angular Frequency', 'ω = √(k/m)', 'Angular frequency in terms of spring constant and mass', ARRAY['oscillations', 'shm', 'frequency']),
  ('15', 'Oscillations', 'Simple Harmonic Motion', 'Period', 'T = 2π√(m/k)', 'Period of oscillation', ARRAY['oscillations', 'shm', 'period']),
  ('16', 'Waves - I', 'Wave Properties', 'Wave Speed', 'v = fλ', 'Relationship between wave speed, frequency, and wavelength', ARRAY['waves', 'speed', 'frequency']);
```

---

### **Step 9: 테스트**

1. 개발 서버 재시작: `npm run dev`
2. 브라우저에서 http://localhost:3000 접속
3. 다음 기능 테스트:
   - ✅ 회원가입
   - ✅ 로그인
   - ✅ Station 페이지 접속
   - ✅ Access Code 입력 (1234)
   - ✅ Study 페이지 접속

---

## 📊 데이터베이스 구조 요약

### **핵심 테이블**

| 테이블 | 용도 | 주요 컬럼 |
|--------|------|-----------|
| `profiles` | 유저 정보 | nickname, is_physics_unlocked, role |
| `formulas` | 공식 DB | chapter_id, title, formula, tags |
| `comments` | 댓글/토론 | chapter_id, content, upvotes |
| `bookmarks` | 북마크 | resource_type, resource_id |
| `messages` | 채팅/DM | sender_id, recipient_id, content |
| `notifications` | 알림 | type, title, is_read |
| `progress` | 학습 진도 | chapter_id, completion_percentage |
| `votes` | 투표 | comment_id, vote_type |
| `signals` | 피드백 | email, message, status |
| `search_history` | 검색 기록 | query, results_count |

---

## 🔒 보안 기능

### **Row Level Security (RLS)**
모든 테이블에 RLS가 활성화되어 있으며, 다음 정책이 적용됩니다:

- ✅ **Profiles**: 모두 읽기 가능, 본인만 수정 가능
- ✅ **Formulas**: 모두 읽기 가능, 관리자만 추가 가능
- ✅ **Comments**: 모두 읽기 가능, 인증된 사용자만 작성 가능
- ✅ **Bookmarks**: 본인 것만 읽기/쓰기 가능
- ✅ **Messages**: 발신자/수신자만 읽기 가능
- ✅ **Progress**: 본인 것만 읽기/쓰기 가능

### **자동 트리거**
- 🔄 **회원가입 시**: `profiles` 자동 생성
- 🔄 **업데이트 시**: `updated_at` 자동 갱신

---

## 🐛 문제 해결 (Troubleshooting)

### ❌ "relation already exists" 에러
- **원인**: 테이블이 이미 존재함
- **해결**: 기존 테이블을 삭제하거나 SQL의 `IF NOT EXISTS` 부분 확인

### ❌ "permission denied" 에러
- **원인**: RLS 정책 문제
- **해결**: SQL Editor에서 해당 정책을 다시 생성

### ❌ 회원가입 후 profiles 테이블에 데이터가 안 들어감
- **원인**: 트리거가 실행되지 않음
- **해결**: `handle_new_user()` 함수와 트리거를 다시 생성

### ❌ 로그인 후 "Session creation failed"
- **원인**: 이메일 인증 대기 중
- **해결**: Step 5의 이메일 인증 비활성화 또는 이메일 확인

---

## 📞 추가 도움이 필요하면?

1. Supabase 공식 문서: https://supabase.com/docs
2. Discord 커뮤니티: https://discord.supabase.com
3. SQL Editor에서 에러 메시지 확인

---

## ✅ 완료 체크리스트

- [ ] SQL 스키마 실행 완료
- [ ] 10개 테이블 모두 생성 확인
- [ ] RLS 활성화 확인
- [ ] 환경 변수 설정 확인
- [ ] 관리자 계정 설정 완료
- [ ] 회원가입/로그인 테스트 완료
- [ ] Station 페이지 접속 확인

---

**🎉 축하합니다! 데이터베이스 설정이 완료되었습니다!**
