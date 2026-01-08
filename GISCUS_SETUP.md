# Giscus 댓글 기능 설정 가이드

이 프로젝트는 **Giscus**를 사용하여 GitHub Discussions 기반의 댓글 시스템을 제공합니다.

## 📋 준비사항

- GitHub 계정
- 프로젝트를 위한 Public GitHub Repository

## 🚀 설정 단계

### 1. GitHub Repository 생성 및 설정

1. GitHub에서 새로운 **public repository**를 생성합니다
   - 예: `your-username/physics-ii`

2. Repository 설정에서 **Discussions**를 활성화합니다:
   - Repository → **Settings** → **Features**
   - **Discussions** 체크박스 선택

### 2. Giscus 설정 값 가져오기

1. [https://giscus.app](https://giscus.app) 방문

2. **Configuration** 섹션에서:
   - **Repository:** 입력란에 `your-username/physics-ii` 입력
   - ✅ 체크 표시가 나타나는지 확인

3. **Discussion Category** 선택:
   - 추천: **General** 또는 **Q&A**

4. **Features** 설정:
   - ✅ Enable reactions for the main post (선택)
   - Placement: **above the comments** (이미 설정됨)

5. **Theme** 설정:
   - **light** 선택 (웹사이트 테마와 일치)

6. 페이지 하단에서 생성된 값들을 복사:
   ```
   data-repo="your-username/physics-ii"
   data-repo-id="R_kgDO..." 
   data-category="General"
   data-category-id="DIC_kwDO..."
   ```

### 3. 프로젝트에 설정 적용

`config/giscus.ts` 파일을 열어서 다음 값들을 업데이트하세요:

```typescript
export const giscusConfig = {
  repo: 'your-username/physics-ii',        // 여기에 repo 입력
  repoId: 'R_kgDO...',                     // 여기에 repo ID 입력
  category: 'General',                      // 여기에 category 입력
  categoryId: 'DIC_kwDO...',               // 여기에 category ID 입력
  theme: 'light',
  lang: 'en',
  loading: 'lazy' as const,
};

export const contactEmail = 'your-email@example.com'; // 실제 이메일로 변경
```

### 4. 테스트

1. 개발 서버를 실행:
   ```bash
   npm run dev
   ```

2. 브라우저에서 `http://localhost:3000/chapter/15` 접속

3. 페이지 하단에 댓글 섹션이 나타나는지 확인

4. 테스트 댓글 작성 (GitHub 로그인 필요)

## 🎨 커스터마이징

### 테마 변경

`config/giscus.ts`에서 `theme` 값 변경:

```typescript
theme: 'light',        // 밝은 테마
// 또는
theme: 'dark',         // 어두운 테마
// 또는
theme: 'preferred_color_scheme', // 시스템 설정 따름
```

### 언어 변경

```typescript
lang: 'en',    // 영어
// 또는
lang: 'ko',    // 한국어
```

### 카테고리 변경

GitHub Repository → Discussions → Categories에서 새 카테고리를 만들고,
giscus.app에서 새로운 category ID를 가져와 업데이트하세요.

## 🔍 문제 해결

### 댓글이 표시되지 않아요

1. Repository가 **public**인지 확인
2. Discussions가 활성화되어 있는지 확인
3. `config/giscus.ts`의 모든 ID 값이 정확한지 확인
4. 브라우저 콘솔에서 오류 메시지 확인

### "Error: Bad credentials" 오류

- `repoId`와 `categoryId` 값을 다시 확인하세요
- giscus.app에서 다시 설정을 진행하고 새 값을 가져오세요

### 댓글이 다른 페이지에도 표시되어요

- 현재 설정은 `mapping="specific"`와 `term`을 사용하여 각 챕터마다 독립적인 Discussion을 생성합니다
- 각 챕터는 "Chapter X: Title" 형식의 고유한 term을 사용합니다

## 📧 오류 제보 기능

페이지 상단의 "⚠️ Found an error in this content?" 버튼은 자동으로:
- 챕터 정보가 포함된 이메일 제목 생성
- 오류 설명 템플릿 제공
- 설정한 이메일 주소로 메일 클라이언트 열기

이메일 주소를 변경하려면 `config/giscus.ts`의 `contactEmail`을 수정하세요.

## 🎓 더 알아보기

- [Giscus 공식 문서](https://github.com/giscus/giscus)
- [GitHub Discussions 가이드](https://docs.github.com/en/discussions)

## 💡 팁

- **Announcement** 카테고리를 만들어 중요 공지사항을 올릴 수 있습니다
- **Q&A** 카테고리를 사용하면 Best Answer를 선택할 수 있습니다
- Repository의 Discussions 탭에서 모든 댓글을 관리할 수 있습니다
- Discussions에 라벨을 추가하여 주제별로 분류할 수 있습니다
