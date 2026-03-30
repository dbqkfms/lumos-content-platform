# LUMOS 미디어아트 라이브러리 웹사이트 프로젝트 인수인계 문서 (상세본)

**작성일**: 2026년 2월 13일  
**프로젝트명**: LUMOS - Premium Media Art Library  
**GitHub**: https://github.com/dbqkfms/lumos-media-art-library  
**최신 체크포인트**: `manus-webdev://0f54a8ed`  

---

## 📋 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [현재 구현 상태](#2-현재-구현-상태)
3. [기술 스택](#3-기술-스택)
4. [파일 구조](#4-파일-구조)
5. [주요 기능 상세](#5-주요-기능-상세)
6. [디자인 시스템](#6-디자인-시스템)
7. [사용자 요구사항 (원본 문서 기반)](#7-사용자-요구사항-원본-문서-기반)
8. [미구현 기능](#8-미구현-기능)
9. [알려진 이슈](#9-알려진-이슈)
10. [다음 단계](#10-다음-단계)

---

## 1. 프로젝트 개요

### 1.1 프로젝트 목적
- **Visual Showroom + Inquiry 기반 Lead Generation**을 목표로 하는 B2B 미디어아트 갤러리
- 결제 기능 없이 **시각적 설득 도구**로 활용
- **STANDARD**(프리미엄 미디어아트) / **LOCAL**(한국적 상업용 콘텐츠) 이원화 구조

### 1.2 핵심 가치
1. **공간 정체성 (Identity)**: 단순 재생이 아닌, 공간의 메시지를 결정하는 콘텐츠 자산
2. **하드웨어 이후 해결 (Post-Hardware Solution)**: LED 설치 후 콘텐츠 부재 문제 해결
3. **이원화 설계 (Dual Structure)**: STANDARD (프리미엄) + LOCAL (상업용)
4. **큐레이션 (Curation)**: 테마/시나리오 중심 분류로 '고르는 비용' 절감
5. **확장성 (Scalability)**: 갤러리 → 플랫폼으로 성장

### 1.3 타겟 사용자
- **B2B 고객**: 갤러리, 미술관, 호텔, 카페, 레스토랑, 오피스 등
- **영업 미팅**: 태블릿, 노트북으로 시각적 제안 도구로 활용

---

## 2. 현재 구현 상태

### 2.1 완료된 기능 ✅

#### 페이지
1. **Home 페이지** (`/`)
   - Hero Section: 풀스크린 영상 배경 (실제 영상 적용)
   - World Selection: STANDARD/LOCAL 50/50 분할 (각각 영상 배경)
   - Case Studies: 4개 사례 카드 (호텔, 갤러리, 카페, 오피스)
   - About 섹션: LUMOS 브랜드 소개
   - Footer

2. **STANDARD World 페이지** (`/standard`)
   - Hero Section: 풀스크린 영상 (2번 영상 적용)
   - 필터 탭: All, Abstract, Cosmic, Material, Light, Pattern
   - 갤러리: 12개 작품 (카드 스타일, 16:9 비율)
   - CTA Section

3. **LOCAL World 페이지** (`/local`)
   - Hero Section: 풀스크린 영상 (3번 영상 적용, 텍스트 가독성 강화)
   - 필터 탭: All, Traditional, Nature, Seasonal
   - 갤러리: 10개 작품 (카드 스타일, 16:9 비율, 한국 전통 소재)
   - CTA Section

4. **작품 상세 페이지** (`/artwork/:id`)
   - 풀스크린 몰입형 디자인
   - 작품 이미지/영상 표시
   - 작품 정보 (제목, 설명, 카테고리, 스펙)
   - 뒤로 가기 버튼

#### 컴포넌트
1. **Header** (`/components/Header.tsx`)
   - 고정 헤더 (모든 페이지 공통)
   - 로고 (LUMOS)
   - 네비게이션: HOME, STANDARD, LOCAL, ABOUT, CONTACT
   - STANDARD/LOCAL 드롭다운 메뉴 (호버 시 표시)
   - **currentWorld** prop으로 현재 페이지 표시

2. **FloatingCTA** (`/components/FloatingCTA.tsx`)
   - 우측 하단 고정 버튼
   - "Contact Us" 텍스트
   - 클릭 시 toast 메시지 (현재는 플레이스홀더)

#### 디자인 시스템
- **디자인 철학**: Luminous Brutalism (빛의 잔혹주의)
- **폰트**: Cormorant Garamond (Display) + Pretendard (Body) + Inter (Accent)
- **색상**:
  - STANDARD: 블랙 배경 + 골드 액센트 (#D4AF37)
  - LOCAL: 화이트 배경 + 그레이 톤
- **레이아웃**: 비대칭, 빛나는 구분선, 빛의 궤적

#### 데이터
- **STANDARD 작품**: 12개 (`/data/standardArtworks.ts`)
  - 카테고리: Abstract, Cosmic, Material, Light, Pattern
  - 각 작품: id, title, description, image, category, displayType, runtime

- **LOCAL 작품**: 10개 (`/data/localArtworks.ts`)
  - 카테고리: Traditional, Nature, Seasonal
  - 한국 전통 소재: 학의 비상, 전통 연날리기, 매화의 향기, 단청의 기하학, 부채의 춤 등

#### 영상 에셋
- **Hero 영상** (Home): `20260210_1436_01kgrqp3jyf8nrv28qnhpxp83w.mp4`
- **STANDARD Hero 영상**: `20260205_1309_01kgnt3acje9v8e098tjr09paf.mp4`
- **LOCAL Hero 영상**: `Xml_version10_encodingutf8_202512(2).mp4`
- 모든 영상은 S3 CDN에 업로드됨

#### 이미지 에셋
- **나노바나나 프로 생성 이미지**: 8개 (Hero, STANDARD 갤러리)
- **저렴한 생성 이미지**: 10개 (LOCAL 갤러리 - 한국 전통 소재)
- 모든 이미지는 S3 CDN에 업로드됨

### 2.2 미완료 기능 ❌

#### 페이지
1. **About 페이지** (`/about`) - Header 버튼만 있음, 페이지 없음
2. **Contact 페이지** (`/contact`) - Header 버튼만 있음, 페이지 없음

#### 기능
1. **실제 문의 기능**: FloatingCTA, Contact 버튼 클릭 시 toast만 표시 (실제 폼 없음)
2. **작품 상세 페이지 확장**: 관련 작품 추천, 다운로드 옵션, 사양 정보 없음
3. **모바일 반응형**: 메가 메뉴가 모바일에서 최적화되지 않음
4. **검색 기능**: 없음
5. **플레이리스트/컬렉션**: 없음
6. **관리자 페이지**: 없음
7. **AI 추천**: 없음

---

## 3. 기술 스택

### 3.1 프론트엔드
- **React**: 19.2.1
- **Tailwind CSS**: 4.1.14
- **shadcn/ui**: 다양한 UI 컴포넌트
- **Wouter**: 3.3.5 (라우팅)
- **Framer Motion**: 12.23.22 (애니메이션)
- **Lucide React**: 0.453.0 (아이콘)

### 3.2 백엔드
- **Express**: 4.21.2 (정적 파일 서빙)
- **Node.js**: 22.13.0

### 3.3 빌드 도구
- **Vite**: 7.1.7
- **TypeScript**: 5.6.3
- **pnpm**: 10.15.1

### 3.4 배포
- **Manus**: 웹 호스팅
- **S3 CDN**: 이미지/영상 스토리지

---

## 4. 파일 구조

```
/home/ubuntu/lumos-website/
├── client/
│   ├── index.html                  # HTML 엔트리 (Google Fonts 로드)
│   ├── public/                     # 정적 파일 (거의 비어있음, 이미지는 CDN 사용)
│   └── src/
│       ├── App.tsx                 # 라우팅 설정
│       ├── main.tsx                # React 엔트리
│       ├── index.css               # 글로벌 스타일 (Tailwind, 폰트, 색상 변수)
│       ├── components/
│       │   ├── Header.tsx          # 헤더 (메가 메뉴)
│       │   ├── FloatingCTA.tsx     # 플로팅 CTA 버튼
│       │   ├── ErrorBoundary.tsx   # 에러 핸들링
│       │   └── ui/                 # shadcn/ui 컴포넌트
│       ├── pages/
│       │   ├── Home.tsx            # 홈 페이지
│       │   ├── StandardWorld.tsx   # STANDARD 갤러리
│       │   ├── LocalWorld.tsx      # LOCAL 갤러리
│       │   ├── ArtworkDetail.tsx   # 작품 상세
│       │   └── NotFound.tsx        # 404 페이지
│       ├── data/
│       │   ├── standardArtworks.ts # STANDARD 작품 데이터
│       │   └── localArtworks.ts    # LOCAL 작품 데이터
│       ├── contexts/
│       │   └── ThemeContext.tsx    # 테마 컨텍스트 (light 고정)
│       ├── hooks/                  # 커스텀 훅
│       └── lib/
│           └── utils.ts            # 유틸리티 함수
├── server/
│   └── index.ts                    # Express 서버 (정적 파일 서빙)
├── shared/
│   └── const.ts                    # 공유 상수
├── package.json                    # 의존성
├── vite.config.ts                  # Vite 설정
├── tsconfig.json                   # TypeScript 설정
├── ideas.md                        # 디자인 브레인스토밍 (Luminous Brutalism)
├── reference_features_checklist.md # 레퍼런스 사이트 분석
├── navigation_ux_analysis.md       # 메가 메뉴 UX 분석
└── todo.md                         # TODO 리스트
```

---

## 5. 주요 기능 상세

### 5.1 Home 페이지

#### Hero Section
- **영상**: `20260210_1436_01kgrqp3jyf8nrv28qnhpxp83w.mp4` (CDN)
- **텍스트**: "LUMOS", "Light, Redefined.", "LED 디스플레이에 전용 AI 생성 미디어아트 라이브러리"
- **애니메이션**: slow-zoom (CSS 애니메이션)
- **스크롤 인디케이터**: 마우스 아이콘

#### World Selection
- **STANDARD** (좌측 50%):
  - 영상 배경: `20260205_1309_01kgnt3acje9v8e098tjr09paf.mp4`
  - 제목: "STANDARD"
  - 설명: "프리미엄 미디어아트", "갤러리, 미술관, 럭셔리 공간을 위한 글로벌 스탠다드 콘텐츠. 보편적 아름다움으로 공간의 품격을 완성합니다."
  - 버튼: "Explore STANDARD" → `/standard`

- **LOCAL** (우측 50%):
  - 영상 배경: `Xml_version10_encodingutf8_202512(2).mp4`
  - 제목: "LOCAL"
  - 설명: "한국적 상업용 콘텐츠", "한국의 전통미와 자연을 담은 콘텐츠. 카페, 레스토랑, 호텔 등 일상 공간에 한국적 정서를 더합니다."
  - 버튼: "Explore LOCAL" → `/local`

#### Case Studies
- **4개 사례**:
  1. 호텔 로비 (STANDARD)
  2. 갤러리 (STANDARD)
  3. 카페 (LOCAL)
  4. 오피스 (LOCAL)
- 각 카드: 이미지 (Unsplash) + 제목 + 설명
- 호버 시 "View Details" 버튼 (클릭 시 toast - 플레이스홀더)

#### About Section
- **제목**: "빛으로 공간의 정체성을 완성합니다"
- **설명**: LUMOS 브랜드 철학
- **버튼**: "Learn More" (클릭 시 toast - 플레이스홀더)

### 5.2 STANDARD World 페이지

#### Hero Section
- **영상**: `20260205_1309_01kgnt3acje9v8e098tjr09paf.mp4`
- **제목**: "STANDARD"
- **설명**: "글로벌 스탠다드로 완성하는 프리미엄 공간"
- **텍스트 색상**: 골드 (#D4AF37) + 흰색

#### 필터 탭
- **카테고리**: All, Abstract, Cosmic, Material, Light, Pattern
- **활성 탭**: 골드 배경 (#D4AF37) + 검은색 텍스트
- **비활성 탭**: 반투명 흰색 배경 + 회색 텍스트
- **클릭 시**: 해당 카테고리 작품만 필터링

#### 갤러리
- **레이아웃**: 3열 그리드 (gap-6)
- **카드 스타일**:
  - 배경: 다크 그레이 (zinc-900)
  - 테두리: zinc-800
  - 썸네일: 16:9 비율 (aspect-video)
  - 호버 시: 그림자 강화 + 이미지 확대 (scale-105)
- **카드 내용**:
  - 제목: 골드 색상, font-display
  - 설명: 회색, font-body, 2줄 말줄임
  - 카테고리: 대문자, tracking-wider
  - 스펙: displayType · runtime
- **클릭 시**: `/artwork/:id`로 이동

#### CTA Section
- **제목**: "예술의 새로운 차원"
- **설명**: "LUMOS STANDARD는 갤러리, 미술관, 프리미엄 공간을 위한 최고급 미디어아트 콘텐츠를 제공합니다."
- **버튼**: "Contact Us" (클릭 시 홈으로 이동 - 플레이스홀더)

### 5.3 LOCAL World 페이지

#### Hero Section
- **영상**: `Xml_version10_encodingutf8_202512(2).mp4`
- **제목**: "LOCAL" (흰색, 강한 text-shadow)
- **설명**: "한국의 전통미를 현대적으로 재해석한 상업용 미디어아트" (흰색, 강한 text-shadow)
- **배경 오버레이**: 어두운 그라데이션 (from-black/50 via-black/30 to-white/80)

#### 필터 탭
- **카테고리**: All, Traditional, Nature, Seasonal
- **활성 탭**: 다크 그레이 배경 + 흰색 텍스트
- **비활성 탭**: 밝은 회색 배경 + 다크 그레이 텍스트

#### 갤러리
- **레이아웃**: 3열 그리드 (gap-6)
- **카드 스타일**:
  - 배경: 흰색
  - 테두리: gray-200
  - 썸네일: 16:9 비율 (aspect-video)
  - 호버 시: 그림자 강화 + 이미지 확대
- **카드 내용**:
  - 제목: 다크 그레이, font-display
  - 설명: 회색, font-body, 2줄 말줄임
  - 카테고리: 대문자, tracking-wider
  - 스펙: displayType · runtime

#### CTA Section
- **제목**: "일상에 스며드는 한국의 아름다움"
- **설명**: "LUMOS LOCAL은 카페, 레스토랑, 호텔 등 상업 공간을 위한 한국적 정서를 담은 미디어아트를 제공합니다."
- **버튼**: "Contact Us"

### 5.4 작품 상세 페이지

#### 레이아웃
- **풀스크린**: min-h-screen
- **배경**: 블랙 (STANDARD) / 화이트 (LOCAL)
- **뒤로 가기 버튼**: 좌측 상단 (X 아이콘)

#### 콘텐츠
- **작품 이미지**: 큰 이미지 (max-w-4xl)
- **제목**: 큰 폰트, font-display
- **설명**: font-body
- **카테고리**: 배지 스타일
- **스펙**: displayType · runtime

#### 현재 제한사항
- 관련 작품 추천 없음
- 다운로드 옵션 없음
- 상세 사양 정보 없음
- 문의하기 버튼 없음

### 5.5 Header 컴포넌트

#### 구조
- **고정 헤더**: sticky top-0, z-50
- **배경**: 반투명 블랙 (bg-black/90), backdrop-blur-md
- **로고**: "LUMOS" (좌측, 골드 색상)
- **네비게이션**: HOME, STANDARD ▼, LOCAL ▼, ABOUT, CONTACT

#### 메가 메뉴 (드롭다운)
- **트리거**: STANDARD/LOCAL 호버 시
- **내용**: 
  - 카테고리 탭 (1-2단어)
  - 8개 작품 썸네일 그리드 (2x4)
  - "View All STANDARD/LOCAL →" 링크
- **애니메이션**: opacity + translateY (Framer Motion)
- **현재 제한사항**: 모바일 최적화 안 됨

#### currentWorld Prop
- **목적**: 현재 페이지 표시
- **값**: "standard" | "local" | undefined
- **사용**: STANDARD/LOCAL 페이지에서 전달

### 5.6 FloatingCTA 컴포넌트

#### 위치
- **고정**: 우측 하단 (fixed bottom-8 right-8)
- **z-index**: 40

#### 디자인
- **배경**: 골드 (#D4AF37)
- **텍스트**: "Contact Us" (검은색)
- **아이콘**: MessageCircle (Lucide)
- **호버 시**: 배경 밝아짐 (#F4D03F)

#### 현재 제한사항
- 클릭 시 toast만 표시 ("Contact feature coming soon!")
- 실제 문의 폼 없음

---

## 6. 디자인 시스템

### 6.1 디자인 철학: Luminous Brutalism

**핵심 개념**:
- 거친 구조적 요소 + 섬세한 빛의 대비
- LUMOS의 "빛으로 공간의 정체성을 완성"한다는 철학을 시각적으로 구현
- STANDARD(프리미엄)와 LOCAL(상업용)의 이원화된 세계를 블랙+골드 vs 화이트+그레이의 극명한 대비로 표현

**핵심 원칙**:
1. **Brutal Honesty**: 불필요한 장식 제거, 구조적 명확성
2. **Light as Material**: 빛을 물질처럼 다룸, 빛나는 구분선, 빛의 궤적
3. **Asymmetric Power**: 비대칭 레이아웃, 50/50 분할의 긴장감
4. **Monochrome Drama**: 블랙+골드 vs 화이트+그레이

### 6.2 색상 시스템

#### STANDARD (프리미엄)
- **배경**: 블랙 (#000000, oklch(0.141 0.005 285.823))
- **텍스트**: 흰색 (#FFFFFF)
- **액센트**: 골드 (#D4AF37)
- **보조**: 다크 그레이 (zinc-900, zinc-800)

#### LOCAL (상업용)
- **배경**: 화이트 (#FFFFFF), 밝은 회색 (gray-50)
- **텍스트**: 다크 그레이 (#333333, gray-800)
- **액센트**: 다크 그레이 (gray-800)
- **보조**: 밝은 회색 (gray-200, gray-400)

### 6.3 타이포그래피

#### 폰트 패밀리
1. **Display (제목)**: Cormorant Garamond
   - 우아하고 클래식한 세리프 폰트
   - 사용: H1, H2, 작품 제목
   - 클래스: `font-display`

2. **Body (본문)**: Pretendard
   - 한글 최적화 Sans-serif
   - 사용: 본문, 설명, UI 텍스트
   - 클래스: `font-body`

3. **Accent (강조)**: Inter
   - 모던 Sans-serif
   - 사용: 버튼, 카테고리 태그, 네비게이션
   - 클래스: `font-accent`

#### 폰트 크기
- **Hero 제목**: text-8xl (96px) ~ text-9xl (128px)
- **Section 제목**: text-5xl (48px) ~ text-7xl (72px)
- **작품 제목**: text-lg (18px) ~ text-xl (20px)
- **본문**: text-sm (14px) ~ text-base (16px)
- **캡션**: text-xs (12px) ~ text-[10px]

### 6.4 레이아웃

#### 그리드
- **갤러리**: 3열 그리드 (lg:grid-cols-3)
- **Case Studies**: 4열 그리드 (lg:grid-cols-4)
- **간격**: gap-6 (24px)

#### 컨테이너
- **최대 너비**: max-w-7xl (1280px)
- **패딩**: px-4 (모바일), px-8 (데스크톱)

#### 비율
- **썸네일**: aspect-video (16:9)
- **Hero 영상**: h-screen (100vh) 또는 h-[60vh]

### 6.5 애니메이션

#### CSS 애니메이션
- **slow-zoom**: 20초 동안 scale(1) → scale(1.1)
  - 사용: Hero 영상 배경

#### Framer Motion
- **페이지 전환**: opacity + translateY
- **호버 효과**: scale, shadow
- **드롭다운**: opacity + translateY

#### Tailwind Transition
- **duration**: 300ms ~ 700ms
- **ease**: ease-in-out
- **hover**: scale-105, shadow-2xl

### 6.6 시그니처 요소

1. **빛나는 구분선**
   - 골드 색상의 얇은 선
   - 섹션 구분, 강조

2. **빛의 궤적**
   - 그라데이션 오버레이
   - 영상 배경 위 텍스트 가독성 확보

3. **비대칭 분할**
   - World Selection: 50/50 수직 분할
   - 좌측 STANDARD (블랙+골드) vs 우측 LOCAL (화이트+그레이)

4. **text-shadow**
   - 영상 배경 위 텍스트 가독성 강화
   - 클래스: `text-shadow-soft`, `text-shadow-medium`
   - 인라인 스타일: `textShadow: '0 0 40px rgba(0,0,0,0.8)'`

---

## 7. 사용자 요구사항 (원본 문서 기반)

### 7.1 원본 문서 출처
- `LUMOS_STANDARD_웹사이트_필수_기능_디자인_페이지_종합_정리.pdf`
- `LUMOS_Brand미디어아트라이브러리사업기획안(2).pdf`
- `Lumos_브리핑_2026.pdf`
- `LUMOS_프로젝트_통합_총정리_20260129_v2-1.pdf`

### 7.2 필수 페이지 (원본 문서 기준)

#### 1.1 Hero Section (메인 페이지)
- **요구사항**:
  - 강렬한 영상으로 시작 (10초 루프)
  - 공간이 깨지는/금이 가는 연출로 STANDARD/LOCAL 분리
  - Vertical Split Scroll: 스크롤 시 두 세계로 나뉨
  - 블랙 톤, 임팩트 있는 디자인 (화려하기보다 강렬함)
- **현재 구현 상태**:
  - ✅ 강렬한 영상 (실제 영상 적용)
  - ✅ Vertical Split (50/50 분할)
  - ❌ 공간이 깨지는/금이 가는 연출 (없음)
  - ❌ Vertical Split Scroll (스크롤 트리거 애니메이션 없음)

#### 1.2 LUMOS STANDARD 갤러리
- **요구사항**:
  - 압도적, 극적, 대형 시각 구조
  - 다크 배경 (블랙 톤)
  - 강렬한 색상 대비 (레드, 골드, 블루)
  - 큰 썸네일 (3열 그리드)
  - 10대 테마 필터링
  - CTA: "이 작품으로 공간을 랜드마크화하는 제안 받기"
- **현재 구현 상태**:
  - ✅ 다크 배경 (블랙)
  - ✅ 골드 액센트
  - ✅ 3열 그리드
  - ✅ 필터링 (6개 카테고리)
  - ❌ 10대 테마 (현재 6개만)
  - ❌ 무드 키워드, 권장 공간, 스크린 스케일 필터 (없음)
  - ❌ CTA 문구 다름 ("Contact Us")

#### 1.3 LUMOS LOCAL 갤러리
- **요구사항**:
  - 밝은 배경 (화이트/베이지 톤)
  - 부드러운 색상 (파스텔, 자연색)
  - 작은 썸네일 (4열 그리드)
  - 10대 테마 필터링
  - CTA: "업종/공간에 맞는 분위기 패키지 추천 받기"
- **현재 구현 상태**:
  - ✅ 밝은 배경 (화이트)
  - ✅ 부드러운 색상
  - ❌ 4열 그리드 (현재 3열)
  - ✅ 필터링 (4개 카테고리)
  - ❌ 10대 테마 (현재 4개만)
  - ❌ CTA 문구 다름

#### 1.4 작품 상세 페이지
- **요구사항**:
  1. 모자이크 프리뷰 (원본 보호)
     - 영상 일부만 공개 (10초 프리뷰)
     - 워터마크 또는 블러 처리
  2. 작품 정보
     - 제목, 설명
     - 라인업 (STANDARD/LOCAL)
     - 테마, 무드 키워드
     - 권장 공간, 스크린 스케일
     - 제작 기술 (Sora 2 Pro, Midjourney 등)
     - Grade (A/B/C) 배지
  3. 문의 버튼 (강조)
     - "이 작품 문의하기"
     - "상담 예약하기"
  4. 추천 작품
     - 유사 무드/테마 작품 4개
- **현재 구현 상태**:
  - ✅ 작품 이미지 표시
  - ✅ 제목, 설명
  - ✅ 카테고리
  - ✅ displayType, runtime
  - ❌ 모자이크 프리뷰 (현재 원본 이미지 표시)
  - ❌ 라인업 표시 없음
  - ❌ 무드 키워드, 권장 공간, 스크린 스케일 없음
  - ❌ 제작 기술 정보 없음
  - ❌ Grade 배지 없음
  - ❌ 문의 버튼 없음
  - ❌ 추천 작품 없음

#### 1.5 Inquiry Form (문의 페이지)
- **요구사항**:
  - 기본 정보: 이름, 회사명, 이메일, 전화번호
  - 프로젝트 정보: 설치 공간 유형, 스크린 규모, 원하는 분위기, 예산 범위
  - 추가 메시지
  - 제출 후: 확인 메시지 + 이메일 자동 발송
- **현재 구현 상태**:
  - ❌ 문의 페이지 없음
  - ❌ 문의 폼 없음
  - ❌ FloatingCTA 클릭 시 toast만 표시

#### 1.6 About / Philosophy 페이지
- **요구사항**:
  - 브랜드 비전: "Light, Redefined"
  - 브랜드 핵심 가치 5가지
  - One Brand, Two Worlds
  - 제작 시그니처 요소 (STANDARD)
  - Dis Global x Bareun
- **현재 구현 상태**:
  - ✅ Home 페이지에 About 섹션 (간략)
  - ❌ 전용 About 페이지 없음
  - ❌ 브랜드 핵심 가치 5가지 상세 설명 없음
  - ❌ 제작 시그니처 요소 설명 없음

#### 1.7 관리자 페이지 (Admin Dashboard)
- **요구사항**:
  - 콘텐츠 관리: 업로드, 편집, 삭제, 정렬
  - 컬렉션 관리: 생성, 추가/제거, 순서 변경, 공개/비공개
  - 문의 관리: 목록, 상태 관리, 상세 보기, 메모
  - 통계: 조회수, 인기 작품, 검색 키워드, 문의 통계
  - 사용자 관리 (선택)
- **현재 구현 상태**:
  - ❌ 관리자 페이지 없음
  - ❌ 모든 관리 기능 없음

### 7.3 필수 기능 (원본 문서 기준)

#### 2.1 필터링 시스템
- **요구사항**:
  - 라인업: STANDARD, LOCAL
  - 테마: 10대 테마
  - 무드: 키워드 태그
  - 권장 공간: 로비, 전시, 카페, 리테일, 실외
  - 권장 스크린 스케일: 소형, 중형, 대형, 초대형
- **현재 구현 상태**:
  - ✅ 라인업: STANDARD, LOCAL 페이지 분리
  - ✅ 테마: 카테고리 필터 (STANDARD 6개, LOCAL 4개)
  - ❌ 무드 키워드 필터 없음
  - ❌ 권장 공간 필터 없음
  - ❌ 권장 스크린 스케일 필터 없음

#### 2.2 검색 기능
- **요구사항**:
  - 기본 검색: 키워드 검색, 자동완성
  - 고급 검색 (Phase 2): 자연어 기반, AI 추천
- **현재 구현 상태**:
  - ❌ 검색 기능 없음

#### 2.3 문의 기능
- **요구사항**:
  - Inquiry Form
  - Contact CTA (모든 페이지 하단)
  - 자동 응답: 확인 이메일, 관리자 알림
- **현재 구현 상태**:
  - ✅ FloatingCTA (모든 페이지)
  - ❌ 실제 문의 폼 없음
  - ❌ 자동 응답 없음

#### 2.4 플레이리스트/컬렉션
- **요구사항**:
  - 큐레이션된 컬렉션 (관리자 생성)
  - 사용자 저장 기능 (Phase 2): 북마크, 내 플레이리스트
- **현재 구현 상태**:
  - ❌ 컬렉션 기능 없음
  - ❌ 북마크 기능 없음

#### 2.5 Content Grading System
- **요구사항**:
  - Grade A (Premium): 골드 배지
  - Grade B (Certified): 실버 배지
  - Grade C (Basic): 브론즈 배지
- **현재 구현 상태**:
  - ❌ Grade 시스템 없음
  - ❌ 배지 표시 없음

#### 2.6 모자이크 프리뷰 (원본 보호)
- **요구사항**:
  - 10초 프리뷰
  - 워터마크
  - 블러 처리
  - 해상도 제한 (720p)
- **현재 구현 상태**:
  - ❌ 모자이크 프리뷰 없음
  - ❌ 현재 원본 이미지 그대로 표시

### 7.4 디자인 원칙 (원본 문서 기준)

#### 3.1 STANDARD vs LOCAL 시각적 차별화
- **요구사항** vs **현재 구현**:

| 항목 | STANDARD (요구) | STANDARD (현재) | LOCAL (요구) | LOCAL (현재) |
|------|----------------|----------------|--------------|-------------|
| 배경색 | 블랙 | ✅ 블랙 | 화이트/베이지 | ✅ 화이트 |
| 텍스트색 | 화이트 | ✅ 화이트 | 다크 그레이 | ✅ 다크 그레이 |
| 강조색 | 레드/골드 | ✅ 골드 | 블루/그린 | ❌ 다크 그레이 |
| 폰트 | Montserrat Bold | ❌ Cormorant Garamond | Montserrat Light | ❌ Pretendard |
| 썸네일 크기 | 큼 (3열) | ✅ 3열 | 작음 (4열) | ❌ 3열 |
| 애니메이션 | 강렬함 | ✅ 강렬함 | 부드러움 | ✅ 부드러움 |

#### 3.2 블랙 톤, 임팩트 있는 디자인
- **요구사항**: 화려하기보다 강렬함, 미니멀리즘, 대비 강조
- **현재 구현**: ✅ 블랙 톤, 골드 액센트, 미니멀리즘

#### 3.3 영상 중심 설계
- **요구사항**: Hero 풀스크린 영상, 갤러리 호버 시 영상 자동 재생, 작품 상세 영상 플레이어
- **현재 구현**:
  - ✅ Hero 풀스크린 영상
  - ❌ 갤러리 호버 시 영상 재생 없음 (정적 이미지만)
  - ❌ 작품 상세 영상 플레이어 없음

### 7.5 구현 우선순위 (원본 문서 기준)

#### Phase 5 (즉시 구현 - 1주)
1. ✅ Hero Section - Vertical Split 디자인
2. ✅ STANDARD vs LOCAL 갤러리 - 시각적 차별화
3. ❌ Inquiry Form - 문의 기능
4. ❌ About / Philosophy - 브랜드 철학 페이지
5. ❌ 관리자 페이지 - 콘텐츠 관리, 컬렉션 관리, 문의 관리
6. ❌ Content Grading System - Grade A/B/C 표시
7. ❌ 모자이크 프리뷰 - 원본 보호
8. ❌ 큐레이션된 컬렉션 - 관리자 생성
9. ❌ iframe 임베드 가이드 - 디스글로벌 연동

#### Phase 6 (중간 우선순위 - 2~3주)
1. ❌ AI 추천 시스템 - 유사 작품 추천
2. ❌ 자동 태그 생성 - 영상 분석
3. ❌ 스마트 검색 - 자연어 기반
4. ❌ JavaScript 위젯 - 디스글로벌 연동
5. ❌ 사용자 저장 기능 - 북마크, 플레이리스트

#### Phase 7 (장기 - 1~2개월)
1. ❌ 설치 시뮬레이션 - AR 기반
2. ❌ B2B 고급 기능 - 커스텀 큐레이션
3. ❌ Web Components - 재사용성
4. ❌ IP 기반 송출 시스템 - 1 IP = 1 Location

---

## 8. 미구현 기능

### 8.1 긴급 (Phase 5)

#### 1. Inquiry Form (문의 기능)
- **위치**: `/contact` 페이지
- **필수 필드**:
  - 기본 정보: 이름, 회사명, 이메일, 전화번호
  - 프로젝트 정보: 설치 공간 유형, 스크린 규모, 원하는 분위기, 예산 범위
  - 추가 메시지
- **제출 후**:
  - "문의가 접수되었습니다. 영업일 기준 1~2일 내 연락드리겠습니다."
  - 이메일 자동 발송 (확인 메일)
  - 관리자에게 알림 (이메일, Slack 등)
- **현재 상태**: FloatingCTA 클릭 시 toast만 표시

#### 2. About / Philosophy 페이지
- **위치**: `/about` 페이지
- **필수 섹션**:
  - 브랜드 비전: "Light, Redefined"
  - 브랜드 핵심 가치 5가지
  - One Brand, Two Worlds
  - 제작 시그니처 요소 (STANDARD)
  - Dis Global x Bareun
- **현재 상태**: Home 페이지에 간략한 About 섹션만

#### 3. 관리자 페이지
- **위치**: `/admin` 페이지
- **필수 기능**:
  - 콘텐츠 관리: 업로드, 편집, 삭제, 정렬
  - 컬렉션 관리: 생성, 추가/제거, 순서 변경, 공개/비공개
  - 문의 관리: 목록, 상태 관리, 상세 보기, 메모
  - 통계: 조회수, 인기 작품, 검색 키워드, 문의 통계
- **현재 상태**: 없음

#### 4. Content Grading System
- **Grade A (Premium)**: 골드 배지
- **Grade B (Certified)**: 실버 배지
- **Grade C (Basic)**: 브론즈 배지
- **표시 위치**: 작품 썸네일 상단, 작품 상세 페이지
- **필터링**: Grade 필터 추가
- **현재 상태**: 없음

#### 5. 모자이크 프리뷰 (원본 보호)
- **방법**:
  - 10초 프리뷰: 전체 영상 중 10초만 공개
  - 워터마크: LUMOS 로고 오버레이
  - 블러 처리: 일부 구간 블러
  - 해상도 제한: 720p로 제한 (원본은 4K)
- **원본 제공**: 계약 체결 후 원본 파일 제공 (다운로드 링크, 유효기간 7일)
- **현재 상태**: 원본 이미지 그대로 표시

#### 6. 큐레이션된 컬렉션
- **예시**:
  - "여름 특집"
  - "호텔 로비 추천"
  - "한국 전통 미디어아트"
  - "명상/힐링 공간"
- **관리**: 관리자 페이지에서 생성/편집
- **표시**: Home 페이지 또는 전용 컬렉션 페이지
- **현재 상태**: 없음

### 8.2 중간 우선순위 (Phase 6)

#### 7. 작품 상세 페이지 확장
- **추가 필요 요소**:
  - 라인업 표시 (STANDARD/LOCAL)
  - 무드 키워드
  - 권장 공간
  - 권장 스크린 스케일
  - 제작 기술 (Sora 2 Pro, Midjourney 등)
  - Grade 배지
  - "이 작품 문의하기" 버튼
  - 추천 작품 (유사 무드/테마 작품 4개)
- **현재 상태**: 기본 정보만 (제목, 설명, 카테고리, 스펙)

#### 8. 검색 기능
- **기본 검색**:
  - 키워드 검색 (제목, 설명, 태그)
  - 자동완성 (인기 검색어, 태그)
- **고급 검색 (Phase 2)**:
  - 자연어 기반 검색 ("차분한 카페용 영상")
  - AI 추천 ("이 작품과 유사한 작품")
- **현재 상태**: 없음

#### 9. 필터링 시스템 확장
- **추가 필터**:
  - 무드 키워드 (차분한, 역동적, 따뜻한, 차가운 등)
  - 권장 공간 (로비, 전시, 카페, 리테일, 실외)
  - 권장 스크린 스케일 (소형, 중형, 대형, 초대형)
- **현재 상태**: 카테고리 필터만

#### 10. 플레이리스트/컬렉션 (사용자)
- **기능**:
  - 북마크 (하트 아이콘)
  - 내 플레이리스트 생성
  - 공유 기능
- **현재 상태**: 없음

#### 11. AI 추천 시스템
- **기능**:
  - 유사 작품 추천 (무드/테마 기반)
  - 자동 태그 생성 (영상 분석)
  - 스마트 검색 (자연어 기반)
- **현재 상태**: 없음

### 8.3 장기 (Phase 7)

#### 12. 갤러리 호버 시 영상 자동 재생
- **요구사항**: 작품 카드에 마우스를 올리면 짧은 영상 프리뷰가 자동 재생
- **현재 상태**: 정적 이미지만

#### 13. 작품 상세 영상 플레이어
- **요구사항**: 영상 재생, 일시정지, 전체화면, 볼륨 조절
- **현재 상태**: 정적 이미지만

#### 14. 모바일 반응형 최적화
- **요구사항**:
  - 햄버거 메뉴 (메가 메뉴 대체)
  - 갤러리 그리드 반응형 (1열 → 2열 → 3열)
  - 터치 제스처 최적화
- **현재 상태**: 기본 반응형만 (메가 메뉴 모바일 최적화 안 됨)

#### 15. SEO 최적화
- **요구사항**:
  - 메타 태그 (title, description, keywords)
  - Open Graph 이미지
  - robots.txt, sitemap.xml
- **현재 상태**: 기본 title만

#### 16. 설치 시뮬레이션 (AR)
- **요구사항**: AR 기반 설치 시뮬레이션
- **현재 상태**: 없음

#### 17. iframe 임베드 가이드
- **요구사항**: 디스글로벌 사이트에 LUMOS 갤러리 삽입
- **현재 상태**: 없음

---

## 9. 알려진 이슈

### 9.1 긴급

#### 1. LOCAL 갤러리 그리드 (4열 → 3열)
- **요구사항**: 4열 그리드
- **현재**: 3열 그리드
- **이유**: 사용자가 "더 세련되게" 요청하여 STANDARD와 동일하게 3열로 변경
- **해결 방법**: 필요 시 `lg:grid-cols-4`로 변경

#### 2. LOCAL 강조색 (블루/그린 → 다크 그레이)
- **요구사항**: 블루/그린 (#4A90E2, #7ED321)
- **현재**: 다크 그레이
- **이유**: 디자인 일관성을 위해 변경
- **해결 방법**: 필요 시 색상 변수 변경

#### 3. 폰트 (Montserrat → Cormorant Garamond + Pretendard)
- **요구사항**: Montserrat Bold (STANDARD), Montserrat Light (LOCAL)
- **현재**: Cormorant Garamond (Display) + Pretendard (Body) + Inter (Accent)
- **이유**: 사용자가 폰트 변경 요청
- **해결 방법**: 필요 시 폰트 변경

### 9.2 중간

#### 4. Hero Section 애니메이션 (Vertical Split Scroll)
- **요구사항**: 스크롤 시 공간이 깨지는/금이 가는 연출
- **현재**: 정적 50/50 분할
- **해결 방법**: GSAP ScrollTrigger로 구현

#### 5. 10대 테마 (6개 → 10개)
- **요구사항**: 10대 테마 (자연/원소, 우주/코스믹, 감정/추상, 생명/유기체, 도시/건축, 시간/계절, 기술/디지털, 명상/힐링, 축제/경축, 신화/판타지)
- **현재**: STANDARD 6개, LOCAL 4개
- **해결 방법**: 카테고리 확장 및 작품 데이터 추가

#### 6. 작품 데이터 부족
- **요구사항**: 각 테마별 충분한 작품 (최소 10개씩)
- **현재**: STANDARD 12개, LOCAL 10개
- **해결 방법**: 작품 데이터 추가 (이미지 생성 또는 실제 작품)

### 9.3 낮음

#### 7. 영상 파일 크기
- **현재**: 영상 파일이 크므로 모바일에서 로딩 느림
- **해결 방법**: 모바일용 저해상도 버전 또는 정적 이미지로 대체

#### 8. 브라우저 캐시
- **현재**: 영상/이미지 캐싱 최적화 안 됨
- **해결 방법**: CDN 캐싱 설정, Service Worker

---

## 10. 다음 단계

### 10.1 즉시 실행 (1주)

#### 1. Contact 페이지 구현
- **우선순위**: 최고
- **이유**: 문의 기능이 프로젝트의 핵심 목표 (Lead Generation)
- **작업**:
  1. `/contact` 페이지 생성
  2. Inquiry Form 구현 (기본 정보 + 프로젝트 정보)
  3. 제출 시 이메일 발송 (web-db-user 업그레이드 필요)
  4. FloatingCTA 버튼 연결

#### 2. About 페이지 구현
- **우선순위**: 높음
- **이유**: 브랜드 철학 전달이 중요
- **작업**:
  1. `/about` 페이지 생성
  2. 브랜드 비전, 핵심 가치 5가지, One Brand Two Worlds 섹션
  3. 제작 시그니처 요소 (STANDARD) 설명
  4. Dis Global x Bareun 파트너십 소개

#### 3. 작품 상세 페이지 확장
- **우선순위**: 높음
- **이유**: 작품 정보 부족
- **작업**:
  1. 작품 데이터에 필드 추가 (무드, 권장 공간, 스크린 스케일, 제작 기술, Grade)
  2. 작품 상세 페이지에 추가 정보 표시
  3. "이 작품 문의하기" 버튼 추가
  4. 추천 작품 섹션 추가 (유사 카테고리 4개)

#### 4. Content Grading System
- **우선순위**: 중간
- **이유**: 작품 품질 구분 필요
- **작업**:
  1. 작품 데이터에 `grade` 필드 추가 (A/B/C)
  2. 썸네일 상단에 배지 표시 (골드/실버/브론즈)
  3. 필터에 Grade 옵션 추가

### 10.2 중간 우선순위 (2~3주)

#### 5. 모자이크 프리뷰 (원본 보호)
- **우선순위**: 높음
- **이유**: 원본 보호가 비즈니스 모델의 핵심
- **작업**:
  1. 영상 프리뷰 생성 (10초, 워터마크, 블러, 720p)
  2. 작품 데이터에 `previewUrl` 필드 추가
  3. 갤러리/상세 페이지에서 프리뷰만 표시
  4. 원본 제공 플로우 (계약 후 다운로드 링크)

#### 6. 관리자 페이지 (기본)
- **우선순위**: 중간
- **이유**: 콘텐츠 관리 효율화
- **작업**:
  1. `/admin` 페이지 생성 (인증 필요)
  2. 콘텐츠 관리: 업로드, 편집, 삭제
  3. 문의 관리: 목록, 상태 관리, 상세 보기
  4. 기본 통계: 조회수, 인기 작품

#### 7. 큐레이션된 컬렉션
- **우선순위**: 중간
- **이유**: 사용자 경험 개선
- **작업**:
  1. 컬렉션 데이터 구조 설계
  2. 관리자 페이지에서 컬렉션 생성/편집
  3. Home 페이지에 "Featured Collections" 섹션 추가
  4. 컬렉션 상세 페이지 (`/collection/:id`)

#### 8. 검색 기능 (기본)
- **우선순위**: 중간
- **이유**: 사용자 편의성
- **작업**:
  1. Header에 검색 바 추가
  2. 키워드 검색 (제목, 설명, 태그)
  3. 검색 결과 페이지 (`/search?q=...`)
  4. 자동완성 (인기 검색어)

### 10.3 장기 (1~2개월)

#### 9. 갤러리 호버 시 영상 자동 재생
- **우선순위**: 낮음
- **이유**: UX 개선 (필수는 아님)
- **작업**:
  1. 작품 데이터에 `videoUrl` 필드 추가
  2. 갤러리 카드에 `<video>` 태그 추가
  3. 호버 시 `play()`, 마우스 아웃 시 `pause()`

#### 10. 모바일 반응형 최적화
- **우선순위**: 중간
- **이유**: 모바일 트래픽 증가
- **작업**:
  1. Header 햄버거 메뉴 구현
  2. 메가 메뉴 모바일 버전 (드로어 스타일)
  3. 갤러리 그리드 반응형 (1열 → 2열 → 3열)
  4. 터치 제스처 최적화

#### 11. AI 추천 시스템
- **우선순위**: 낮음
- **이유**: 고급 기능 (나중에)
- **작업**:
  1. 작품 임베딩 생성 (벡터 DB)
  2. 유사 작품 추천 API
  3. 작품 상세 페이지에 추천 작품 표시
  4. 자연어 검색 ("차분한 카페용 영상")

#### 12. SEO 최적화
- **우선순위**: 낮음
- **이유**: 검색 엔진 노출
- **작업**:
  1. 메타 태그 추가 (title, description, keywords)
  2. Open Graph 이미지 설정
  3. robots.txt, sitemap.xml 생성
  4. 구조화된 데이터 (Schema.org)

---

## 📝 요약 (Quick Reference)

### 현재 상태
- ✅ **완료**: Home, STANDARD, LOCAL 페이지, 작품 상세, Header, FloatingCTA, 디자인 시스템
- ❌ **미완료**: About, Contact 페이지, 문의 기능, 관리자 페이지, 검색, 컬렉션, Grade 시스템, 모자이크 프리뷰

### 긴급 작업 (1주)
1. Contact 페이지 + Inquiry Form
2. About 페이지
3. 작품 상세 페이지 확장
4. Content Grading System

### 중간 작업 (2~3주)
5. 모자이크 프리뷰
6. 관리자 페이지 (기본)
7. 큐레이션된 컬렉션
8. 검색 기능 (기본)

### 장기 작업 (1~2개월)
9. 갤러리 호버 영상
10. 모바일 반응형
11. AI 추천
12. SEO

### 주요 파일
- **Home**: `/client/src/pages/Home.tsx`
- **STANDARD**: `/client/src/pages/StandardWorld.tsx`
- **LOCAL**: `/client/src/pages/LocalWorld.tsx`
- **작품 상세**: `/client/src/pages/ArtworkDetail.tsx`
- **Header**: `/client/src/components/Header.tsx`
- **FloatingCTA**: `/client/src/components/FloatingCTA.tsx`
- **STANDARD 데이터**: `/client/src/data/standardArtworks.ts`
- **LOCAL 데이터**: `/client/src/data/localArtworks.ts`
- **스타일**: `/client/src/index.css`

### 주요 영상
- **Hero**: `20260210_1436_01kgrqp3jyf8nrv28qnhpxp83w.mp4`
- **STANDARD Hero**: `20260205_1309_01kgnt3acje9v8e098tjr09paf.mp4`
- **LOCAL Hero**: `Xml_version10_encodingutf8_202512(2).mp4`

### 디자인 시스템
- **철학**: Luminous Brutalism
- **폰트**: Cormorant Garamond (Display) + Pretendard (Body) + Inter (Accent)
- **색상**: STANDARD (블랙+골드), LOCAL (화이트+그레이)

---

**문서 끝**
