# Vercel 배포 오류 해결 가이드

## 🔴 문제

Vercel이 이전 커밋(`241b1e8`)을 빌드하고 있어서 다음 에러가 발생합니다:

```
Module not found: Can't resolve '@/components/Comments'
```

## ✅ 해결 방법

### 옵션 1: Vercel Dashboard에서 재배포 (권장)

1. **Vercel Dashboard 접속**
   - https://vercel.com/dashboard 로 이동
   - `voidspaceplan` 프로젝트 선택

2. **Deployments 탭으로 이동**
   - 상단 메뉴에서 "Deployments" 클릭

3. **최신 커밋 재배포**
   - 최신 커밋 `5f15221 Fix build error: Remove missing Comments component` 찾기
   - 해당 배포의 오른쪽에 있는 "..." 메뉴 클릭
   - **"Redeploy"** 선택
   - **"Use existing Build Cache" 체크 해제** (중요!)
   - "Redeploy" 버튼 클릭

### 옵션 2: Git Push로 강제 재배포

새로운 커밋을 만들어서 Vercel이 자동으로 재배포하도록 합니다:

```bash
# 빈 커밋 생성 (변경사항 없이 재배포 트리거)
git commit --allow-empty -m "chore: Trigger Vercel redeploy"

# GitHub에 푸시
git push origin main
```

### 옵션 3: Vercel CLI 사용

```bash
# Vercel CLI 설치 (아직 없다면)
npm i -g vercel

# 프로젝트 디렉토리에서 실행
vercel --prod
```

---

## 🔍 현재 상태 확인

### 로컬 Git 상태
```bash
$ git log --oneline -5
5f15221 Fix build error: Remove missing Comments component  ✅ 최신
241b1e8 Phase 2: Supabase Login & Dark Station         ❌ Vercel이 이것을 빌드 중
204fab4 Fix authentication and add debugging
131052d fix: Giscus 타입 에러 수정
82b8239 fix: react-katex 타입 수동 선언
```

### 원격 저장소 (GitHub)
```bash
$ git log origin/main --oneline -5
5f15221 Fix build error: Remove missing Comments component  ✅ 최신
241b1e8 Phase 2: Supabase Login & Dark Station
...
```

**결론:** GitHub에는 최신 코드(`5f15221`)가 있지만, Vercel이 이전 커밋(`241b1e8`)을 빌드하고 있습니다.

---

## 📋 수정된 내용 (커밋 5f15221)

### 1. `app/study/chapter/[id]/page.tsx`
- ❌ 제거: `import Comments from '@/components/Comments';`
- ✅ 추가: Placeholder 텍스트로 대체

### 2. 추가 수정 필요 (아직 커밋 안됨)
다음 파일들도 수정되었지만 아직 커밋되지 않았습니다:

#### `app/study/chapter/[id]/page.tsx`
- `physicsData.chapters` → `physicsData` (데이터 구조 변경)
- `chapter.number` → `chapter.id`
- `chapter.imageUrl` 제거

#### `app/actions/auth.ts`
- 중복 프로필 생성 코드 제거 (트리거가 자동 생성)

#### `middleware.ts`
- `/study` 접근 시 `is_physics_unlocked` 확인 추가

#### `app/page.tsx`
- "Remember Device" 체크박스 제거

---

## 🚀 추가 커밋 필요

위의 추가 수정사항들을 커밋하고 푸시해야 합니다:

```bash
# 모든 변경사항 스테이징
git add -A

# 커밋
git commit -m "fix: Data structure updates and access control improvements

- Update chapter page to use new physicsData structure
- Remove duplicate profile creation (handled by DB trigger)
- Add physics_unlocked check in middleware
- Remove unused Remember Device checkbox"

# 푸시
git push origin main
```

이렇게 하면 Vercel이 자동으로 새 배포를 시작합니다.

---

## ⚠️ 주의사항

### Vercel Build Cache
Vercel이 빌드 캐시를 사용하면 이전 버전의 `node_modules`나 빌드 아티팩트를 재사용할 수 있습니다.

**해결책:**
1. Vercel Dashboard에서 재배포 시 **"Use existing Build Cache" 체크 해제**
2. 또는 Project Settings > General > "Clear Build Cache" 클릭

### 환경 변수 확인
Vercel에 다음 환경 변수가 설정되어 있는지 확인하세요:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
PHYSICS_PASSWORD=your_class_password
```

**설정 방법:**
1. Vercel Dashboard > 프로젝트 선택
2. Settings > Environment Variables
3. 각 변수 추가 및 저장
4. 재배포 필요

---

## 📝 체크리스트

배포 전 확인사항:

- [ ] GitHub에 최신 커밋이 푸시되었는지 확인
- [ ] Vercel이 올바른 브랜치(main)를 추적하는지 확인
- [ ] 환경 변수가 Vercel에 설정되어 있는지 확인
- [ ] 빌드 캐시를 클리어했는지 확인
- [ ] 재배포 후 로그 확인

---

## 🎯 예상 결과

재배포 후:
- ✅ 빌드 성공
- ✅ `Comments` 모듈 에러 없음
- ✅ 모든 페이지 정상 작동
- ✅ 인증 및 접근 제어 정상 작동

**배포가 성공하면 https://your-domain.vercel.app 에서 확인하세요!** 🎉
