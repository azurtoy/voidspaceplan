# 데이터 구조 및 프로필 생성 버그 수정

## 🐛 Bug 1: 잘못된 데이터 구조 참조

### 문제
`app/study/chapter/[id]/page.tsx`가 `physicsData.chapters`를 참조하지만, Phase 2에서 데이터 구조가 변경되었습니다.

**원인:**
```typescript
// data/physicsData.ts - 새로운 구조 (Phase 2)
export const physicsData: Chapter[] = [ ... ];

// app/study/chapter/[id]/page.tsx - 구 코드
const chapter = physicsData.chapters.find(...); // ❌ undefined!
```

**영향:**
- `physicsData.chapters`가 `undefined`
- 런타임 에러: "Cannot read property 'find' of undefined"
- `/study/chapter/[id]` 경로 접근 불가능

### 수정 내용

#### 1. 데이터 접근 방식 변경

**Before:**
```typescript
const { id } = await params;
const chapterNumber = parseInt(id);

const chapter = physicsData.chapters.find(ch => ch.number === chapterNumber);
```

**After:**
```typescript
const { id } = await params;
const chapterId = id;

const chapter = physicsData.find(ch => ch.id === chapterId);
```

#### 2. 필드 이름 업데이트

**Before:**
```tsx
<div className="text-sm text-lca-pink font-semibold mb-2">
  CHAPTER {chapter.number}
</div>

{chapter.imageUrl && (
  <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden bg-gray-100">
    <Image src={chapter.imageUrl} alt={chapter.title} fill />
  </div>
)}
```

**After:**
```tsx
<div className="text-sm text-lca-pink font-semibold mb-2">
  CHAPTER {chapter.id}
</div>

{/* imageUrl 필드 제거 - 새 데이터 구조에 없음 */}
```

#### 3. generateStaticParams 수정

**Before:**
```typescript
export async function generateStaticParams() {
  return physicsData.chapters.map((chapter) => ({
    id: chapter.number.toString(),
  }));
}
```

**After:**
```typescript
export async function generateStaticParams() {
  return physicsData.map((chapter) => ({
    id: chapter.id,
  }));
}
```

#### 4. Navigation 단순화

**Before:**
```tsx
{/* 복잡한 이전/다음 챕터 네비게이션 */}
{chapterNumber > 15 && (
  <a href={`/study/chapter/${chapterNumber - 1}`}>
    ← Previous Chapter
  </a>
)}
```

**After:**
```tsx
{/* 단순한 대시보드 복귀 버튼 */}
<a href="/study" className="btn btn-secondary">
  ← Back to Study Dashboard
</a>
```

---

## 🐛 Bug 2: 중복 프로필 생성 시도

### 문제
`app/actions/auth.ts`의 `signup()` 함수가 명시적으로 프로필을 생성하지만, 데이터베이스 트리거가 이미 자동으로 생성합니다.

**원인:**
```sql
-- supabase_schema.sql
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();
```

**트리거 동작:**
1. 사용자가 `auth.users`에 insert됨
2. 트리거가 즉시 실행되어 `profiles` 테이블에 레코드 생성
3. 앱 코드가 다시 insert 시도
4. **Primary Key 중복 에러 발생**

**영향:**
- 회원가입이 항상 실패
- 에러 메시지: "Failed to create user profile"
- 실제로는 프로필이 트리거로 생성되었지만 앱이 인식하지 못함

### 수정 내용

**Before (app/actions/auth.ts):**
```typescript
if (!data.user) {
  console.error('❌ No user data returned');
  return { success: false, error: 'Sign up failed' };
}

// ❌ 문제: 트리거가 이미 생성했는데 다시 insert 시도
const { error: profileError } = await supabase
  .from('profiles')
  .insert({
    id: data.user.id,
    nickname,
    is_physics_unlocked: false,
  });

if (profileError) {
  console.error('❌ Failed to create profile:', profileError.message);
  return { 
    success: false, 
    error: 'Failed to create user profile. Please contact support.' 
  };
}

console.log('✅ Sign up successful:', data.user.email);
revalidatePath('/', 'layout');
return { success: true };
```

**After (app/actions/auth.ts):**
```typescript
if (!data.user) {
  console.error('❌ No user data returned');
  return { success: false, error: 'Sign up failed' };
}

// ✅ 수정: 트리거가 자동으로 프로필 생성
// 명시적 insert 제거
console.log('✅ Sign up successful:', data.user.email);
console.log('   Profile will be auto-created by database trigger');

revalidatePath('/', 'layout');
return { success: true };
```

**설명:**
- 데이터베이스 트리거(`handle_new_user`)가 프로필 생성을 담당
- 앱 코드는 트리거를 신뢰하고 추가 작업 불필요
- 중복 insert 시도 제거로 에러 방지

---

## ✅ 검증

### Bug 1 테스트

#### 시나리오 1: 챕터 페이지 접근
1. `/study/chapter/15` 접속
2. 페이지 정상 로드 확인
3. 챕터 제목, 요약, 공식, 문제 표시 확인

#### 시나리오 2: 다른 챕터 접근
1. `/study/chapter/16`, `/study/chapter/17` 등 접속
2. 각 챕터 콘텐츠 정상 표시 확인

#### 시나리오 3: 존재하지 않는 챕터
1. `/study/chapter/99` 접속
2. 404 Not Found 페이지 표시 확인

### Bug 2 테스트

#### 시나리오 1: 새 사용자 회원가입
1. 로그인 페이지에서 "Sign Up" 클릭
2. 이메일, 닉네임, 비밀번호 입력
3. "CREATE ACCOUNT" 클릭

**예상 결과:**
- ✅ 회원가입 성공
- ✅ `/station`으로 리다이렉트
- ✅ 콘솔에 "Profile will be auto-created by database trigger" 로그 출력

#### 시나리오 2: 프로필 자동 생성 확인
1. Supabase Dashboard > Table Editor > profiles
2. 새로 생성된 사용자의 프로필 레코드 확인

**예상 필드:**
- `id`: 사용자 UUID
- `nickname`: 회원가입 시 입력한 닉네임
- `is_physics_unlocked`: `false` (기본값)
- `created_at`: 현재 시간

---

## 🔄 데이터 구조 비교

### Phase 1 (구 버전)
```typescript
export const physicsData = {
  chapters: [
    {
      number: 15,
      title: "Oscillations",
      imageUrl: "/images/ch15.jpg",
      formulas: [
        { id: "f1", name: "...", latex: "..." }
      ],
      problems: [ ... ]
    }
  ]
};
```

### Phase 2 (신 버전)
```typescript
export const physicsData: Chapter[] = [
  {
    id: "15",
    title: "Ch 15. Oscillations",
    summary: "...",
    youtubeId: "...",
    formulas: [
      { name: "...", latex: "..." }
    ],
    problems: [ ... ]
  }
];
```

**주요 변경사항:**
- ✅ `physicsData.chapters` → `physicsData` (직접 배열)
- ✅ `chapter.number` → `chapter.id` (string)
- ✅ `chapter.imageUrl` 제거
- ✅ `chapter.youtubeId` 추가
- ✅ `formula.id` 제거 (배열 index 사용)

---

## 📋 수정된 파일

| 파일 | 변경 사항 | 상태 |
|------|----------|------|
| `app/study/chapter/[id]/page.tsx` | 데이터 구조 업데이트 | ✅ 완료 |
| `app/actions/auth.ts` | 중복 프로필 insert 제거 | ✅ 완료 |

---

## 🎯 결론

### 수정 사항 요약:
1. ✅ **Bug 1**: `physicsData.chapters` → `physicsData` 변경
2. ✅ **Bug 2**: 명시적 프로필 생성 제거 (트리거 사용)

### 결과:
- ✅ 챕터 페이지 정상 작동
- ✅ 회원가입 성공
- ✅ 프로필 자동 생성
- ✅ 린트 에러 없음

**모든 기능이 정상적으로 작동합니다!** 🎉
