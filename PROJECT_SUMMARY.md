# LUMOS 프로젝트 요약본 (빠른 읽기용)

**작성일**: 2026년 2월 13일  
**GitHub**: https://github.com/dbqkfms/lumos-media-art-library  
**최신 체크포인트**: `manus-webdev://0f54a8ed`  

---

## 🎯 프로젝트 목적

LUMOS는 **B2B 미디어아트 갤러리 웹사이트**입니다. 갤러리, 호텔, 카페 등 LED 디스플레이를 설치한 공간에 프리미엄 미디어아트 콘텐츠를 제공하는 **Visual Showroom + Lead Generation** 플랫폼입니다.

**핵심 구조**: 
- **STANDARD** (프리미엄): 갤러리, 미술관, 럭셔리 공간용 → 블랙+골드 디자인
- **LOCAL** (상업용): 카페, 레스토랑, 호텔용 한국 전통 콘텐츠 → 화이트+그레이 디자인

---

## ✅ 현재 완성된 것

### 페이지 (4개)
1. **Home** (`/`): Hero 영상 + STANDARD/LOCAL 선택 + Case Studies + About
2. **STANDARD** (`/standard`): 프리미엄 갤러리 (12개 작품, 필터 탭)
3. **LOCAL** (`/local`): 한국 전통 갤러리 (10개 작품, 필터 탭)
4. **작품 상세** (`/artwork/:id`): 풀스크린 작품 정보

### 주요 기능
- ✅ 실제 영상 3개 적용 (Hero, STANDARD, LOCAL)
- ✅ 카테고리 필터 (STANDARD 6개, LOCAL 4개)
- ✅ 메가 메뉴 네비게이션 (호버 시 드롭다운)
- ✅ 플로팅 CTA 버튼 (우측 하단)
- ✅ 반응형 그리드 (3열)
- ✅ 작품 카드 (16:9 비율, 호버 효과)

### 디자인
- **철학**: Luminous Brutalism (빛의 잔혹주의)
- **폰트**: Cormorant Garamond (제목) + Pretendard (본문) + Inter (강조)
- **색상**: STANDARD (블랙+골드 #D4AF37), LOCAL (화이트+그레이)
- **레이아웃**: 비대칭, 50/50 분할, 빛나는 구분선

### 콘텐츠
- **STANDARD 작품**: 12개 (나노바나나 프로 생성)
- **LOCAL 작품**: 10개 (한국 전통 소재: 학의 비상, 매화의 향기, 단청의 기하학 등)
- **영상**: 3개 (모두 S3 CDN 업로드)
- **이미지**: 18개 (모두 S3 CDN 업로드)

---

## ❌ 아직 안 된 것 (중요한 순서)

### 긴급 (1주 안에 필요)
1. **Contact 페이지** - 문의 폼 (이름, 이메일, 프로젝트 정보)
2. **About 페이지** - 브랜드 철학, 핵심 가치 5가지
3. **작품 상세 확장** - 문의 버튼, 추천 작품, 상세 사양
4. **Grade 시스템** - A/B/C 배지 (골드/실버/브론즈)

### 중간 (2~3주)
5. **모자이크 프리뷰** - 원본 보호 (10초 프리뷰, 워터마크)
6. **관리자 페이지** - 콘텐츠 관리, 문의 관리
7. **컬렉션** - "여름 특집", "호텔 로비 추천" 등
8. **검색 기능** - 키워드 검색, 자동완성

### 나중에 (1~2개월)
9. 갤러리 호버 시 영상 재생
10. 모바일 반응형 최적화 (햄버거 메뉴)
11. AI 추천 시스템
12. SEO 최적화

---

## 📂 주요 파일 위치

```
/home/ubuntu/lumos-website/
├── client/src/
│   ├── pages/
│   │   ├── Home.tsx              # 홈 페이지
│   │   ├── StandardWorld.tsx     # STANDARD 갤러리
│   │   ├── LocalWorld.tsx        # LOCAL 갤러리
│   │   └── ArtworkDetail.tsx     # 작품 상세
│   ├── components/
│   │   ├── Header.tsx            # 헤더 (메가 메뉴)
│   │   └── FloatingCTA.tsx       # 플로팅 CTA
│   ├── data/
│   │   ├── standardArtworks.ts   # STANDARD 작품 데이터
│   │   └── localArtworks.ts      # LOCAL 작품 데이터
│   └── index.css                 # 디자인 시스템 (폰트, 색상)
└── ideas.md                      # 디자인 브레인스토밍
```

---

## 🎨 디자인 핵심 포인트

### STANDARD (프리미엄)
- **배경**: 블랙
- **강조**: 골드 (#D4AF37)
- **분위기**: 강렬함, 극적, 대형 시각 구조
- **타겟**: 갤러리, 미술관, 럭셔리 공간

### LOCAL (상업용)
- **배경**: 화이트
- **강조**: 다크 그레이
- **분위기**: 부드러움, 편안함, 한국적 정서
- **타겟**: 카페, 레스토랑, 호텔

### 폰트 사용법
- **제목**: `font-display` (Cormorant Garamond)
- **본문**: `font-body` (Pretendard)
- **버튼/태그**: `font-accent` (Inter)

---

## 🚀 다음에 할 일 (우선순위)

### 1단계: Contact 페이지 만들기
- `/contact` 페이지 생성
- 문의 폼: 이름, 이메일, 회사명, 프로젝트 정보
- 제출 시 이메일 발송 (web-db-user 업그레이드 필요)
- FloatingCTA 버튼 연결

### 2단계: About 페이지 만들기
- `/about` 페이지 생성
- 브랜드 비전: "Light, Redefined"
- 핵심 가치 5가지: 공간 정체성, 하드웨어 이후 해결, 이원화 설계, 큐레이션, 확장성
- One Brand, Two Worlds 설명

### 3단계: 작품 상세 페이지 확장
- 작품 데이터에 필드 추가 (무드, 권장 공간, 스크린 스케일, 제작 기술, Grade)
- "이 작품 문의하기" 버튼
- 추천 작품 4개 (유사 카테고리)

---

## 📊 현재 vs 원본 요구사항 비교

| 기능 | 원본 요구 | 현재 상태 | 우선순위 |
|------|----------|----------|---------|
| Hero 영상 | ✅ 10초 루프 | ✅ 완료 | - |
| STANDARD/LOCAL 분리 | ✅ Vertical Split | ✅ 완료 | - |
| 갤러리 필터 | ✅ 10대 테마 | ⚠️ 6개/4개만 | 중간 |
| 작품 상세 | ✅ 모든 정보 | ⚠️ 기본만 | 긴급 |
| 문의 기능 | ✅ Inquiry Form | ❌ 없음 | 긴급 |
| About 페이지 | ✅ 브랜드 철학 | ⚠️ 간략만 | 긴급 |
| 관리자 페이지 | ✅ 콘텐츠 관리 | ❌ 없음 | 중간 |
| Grade 시스템 | ✅ A/B/C 배지 | ❌ 없음 | 긴급 |
| 모자이크 프리뷰 | ✅ 원본 보호 | ❌ 없음 | 중간 |
| 검색 | ✅ 키워드 검색 | ❌ 없음 | 중간 |
| 컬렉션 | ✅ 큐레이션 | ❌ 없음 | 중간 |

---

## 🔧 기술 스택

- **프론트엔드**: React 19 + Tailwind CSS 4 + shadcn/ui
- **라우팅**: Wouter 3.3.5
- **애니메이션**: Framer Motion 12.23.22
- **백엔드**: Express 4.21.2 (정적 파일 서빙)
- **빌드**: Vite 7.1.7 + TypeScript 5.6.3
- **배포**: Manus + S3 CDN

---

## 💡 알아두면 좋은 것

### 영상 교체 방법
1. S3에 영상 업로드: `manus-upload-file video.mp4`
2. CDN URL 복사
3. 해당 페이지 `.tsx` 파일에서 `<source src="...">` 수정

### 작품 추가 방법
1. `/client/src/data/standardArtworks.ts` 또는 `localArtworks.ts` 열기
2. 배열에 새 객체 추가:
```typescript
{
  id: "new-artwork",
  title: "작품 제목",
  description: "작품 설명",
  image: "https://cdn.url/image.png",
  category: "Abstract",
  displayType: "Horizontal",
  runtime: "60 seconds loop"
}
```

### 디자인 수정 방법
- **색상**: `/client/src/index.css` → CSS 변수 수정
- **폰트**: `/client/index.html` → Google Fonts URL 수정
- **레이아웃**: 각 페이지 `.tsx` 파일 → Tailwind 클래스 수정

---

## 📞 문의사항

- **상세 문서**: `PROJECT_HANDOVER_DETAILED.md` 참고
- **TODO 리스트**: `todo.md` 참고
- **디자인 철학**: `ideas.md` 참고
- **레퍼런스 분석**: `reference_features_checklist.md` 참고

---

**요약 끝**
