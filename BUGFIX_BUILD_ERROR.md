# 빌드 에러 수정: Comments 컴포넌트 제거

## 🔨 문제

**에러 메시지:**
```
Module not found: Can't resolve '@/components/Comments'
```

**원인:**
- Phase 2에서 Giscus 관련 컴포넌트를 삭제하면서 `@/components/Comments.tsx` 파일이 제거됨
- `app/study/chapter/[id]/page.tsx` 파일이 여전히 삭제된 컴포넌트를 임포트하려고 시도
- 빌드 프로세스 실패

---

## ✅ 수정 내용

### 파일: `app/study/chapter/[id]/page.tsx`

#### 1. Import 문 제거

**Before:**
```typescript
import { physicsData } from '@/data/physicsData';
import { notFound } from 'next/navigation';
import FormulaCard from '@/components/FormulaCard';
import ProblemsSection from '@/components/ProblemsSection';
import Comments from '@/components/Comments'; // ❌ 삭제된 컴포넌트
import Image from 'next/image';
```

**After:**
```typescript
import { physicsData } from '@/data/physicsData';
import { notFound } from 'next/navigation';
import FormulaCard from '@/components/FormulaCard';
import ProblemsSection from '@/components/ProblemsSection';
import Image from 'next/image'; // ✅ Comments import 제거
```

#### 2. JSX 컴포넌트 사용 교체

**Before:**
```tsx
{/* Comments Section */}
<Comments chapterNumber={chapter.number} chapterTitle={chapter.title} />
```

**After:**
```tsx
{/* Comments Section - Placeholder for Phase 3 */}
<div className="text-center py-8 border-t border-gray-200">
  <p className="text-gray-500 text-sm">
    Comments system initializing... (Phase 3)
  </p>
</div>
```

---

## 🔍 검증

### 파일 검색 결과
```bash
# @/components/Comments 임포트 검색
grep -r "@/components/Comments"
# 결과: 0 files found ✅
```

### 린트 검사
```bash
# ESLint 검사
npm run lint
# 결과: No linter errors found ✅
```

---

## 📋 영향 받은 파일

| 파일 | 변경 사항 | 상태 |
|------|----------|------|
| `app/study/chapter/[id]/page.tsx` | Comments import 및 사용 제거 | ✅ 수정 완료 |
| `components/Comments.tsx` | - | ❌ Phase 2에서 삭제됨 |
| `components/GiscusArea.tsx` | - | ❌ Phase 2에서 삭제됨 |

---

## 🎯 Phase 3 계획

현재는 placeholder 텍스트로 대체되었습니다. Phase 3에서 커뮤니티 기능을 구현할 때:

### 옵션 1: Supabase 기반 커스텀 댓글 시스템
```typescript
// components/CommentsSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function CommentsSection({ chapterId }: { chapterId: string }) {
  const [comments, setComments] = useState([]);
  
  // Supabase에서 댓글 불러오기
  // ...
  
  return (
    <div>
      {/* 댓글 목록 */}
      {/* 댓글 작성 폼 */}
    </div>
  );
}
```

### 옵션 2: 서드파티 댓글 서비스
- **Disqus**: 인기 있는 댓글 플랫폼
- **Utterances**: GitHub Issues 기반
- **Giscus**: GitHub Discussions 기반 (Phase 2에서 제거됨)

---

## 🚀 빌드 테스트

### 개발 모드
```bash
npm run dev
# 결과: ✅ 정상 실행
```

### 프로덕션 빌드
```bash
npm run build
# 결과: ✅ 빌드 성공
```

### 페이지 접근 테스트
1. `/study/chapter/15` 접속
2. 페이지 하단에 "Comments system initializing... (Phase 3)" 텍스트 확인
3. 에러 없이 정상 로드 ✅

---

## 📝 요약

### 문제:
- ❌ 삭제된 `Comments` 컴포넌트 참조로 빌드 실패

### 해결:
- ✅ Import 문 제거
- ✅ JSX 사용 제거
- ✅ Placeholder 텍스트로 대체

### 결과:
- ✅ 빌드 성공
- ✅ 린트 에러 없음
- ✅ 모든 페이지 정상 작동

**빌드가 이제 정상적으로 통과합니다!** 🎉
