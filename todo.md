# LUMOS 웹사이트 개선 TODO

## 🔥 Phase 1: UI/UX 긴급 개선 (즉시)

### 1. 폰트 시스템 정립
- [ ] Google Fonts 추가: Playfair Display, Inter, Space Grotesk
- [ ] index.css에 폰트 패밀리 정의
- [ ] 모든 페이지에 일관된 폰트 적용

### 2. 글씨 색상 가독성 개선
- [ ] Home > Hero: 텍스트에 그림자 추가
- [ ] Home > World Selection: 텍스트 배경 박스 추가
- [ ] About 섹션: 텍스트 대비 강화
- [ ] LOCAL 페이지: 색상 조정

### 3. 네비게이션 개선 - 메가 메뉴 구현
- [ ] Header 컴포넌트 생성 (고정 헤더)
- [ ] MegaMenu 컴포넌트 생성
- [ ] STANDARD 메가 메뉴: 카테고리 탭 + 작품 그리드 (8개)
- [ ] LOCAL 메가 메뉴: 카테고리 탭 + 작품 그리드 (8개)
- [ ] 호버 시 드롭다운 애니메이션 (Framer Motion)
- [ ] 모든 페이지에 Header 적용

---

## 🎨 Phase 2: 콘텐츠 확장 (중요)

### 4. 갤러리 탭/필터 시스템 구현
- [ ] STANDARD 페이지: 필터 탭 추가 (All, Abstract, Cosmic, Material, Light, Pattern)
- [ ] LOCAL 페이지: 필터 탭 추가 (All, Nature, Seasonal, Urban, Minimal)
- [ ] 탭 클릭 시 필터링 로직
- [ ] 활성 탭 하이라이트 표시

### 5. 갤러리 아이템 확장 (15-20개)
- [ ] STANDARD: 15개 작품 데이터 추가
  - Abstract: 3개
  - Cosmic: 3개
  - Material: 3개
  - Light: 3개
  - Pattern: 3개
- [ ] LOCAL: 15개 작품 데이터 추가
  - Nature: 5개
  - Seasonal: 5개
  - Urban: 3개
  - Minimal: 2개
- [ ] 임시 이미지 생성 (저렴한 모델 사용)

### 6. Case Studies 섹션 추가
- [ ] Home 페이지에 Case Studies 섹션 추가
- [ ] 4개 사례 카드 생성
  - 호텔 로비 (STANDARD)
  - 갤러리 (STANDARD)
  - 카페 (LOCAL)
  - 오피스 (LOCAL)
- [ ] 각 사례: 이미지 + 제목 + 설명
- [ ] 호버 시 "View Details" 버튼 (현재는 toast)

---

## 🚀 Phase 3: 기능 완성 (추가)

### 7. 작품 상세 모달 구현
- [ ] ArtworkModal 컴포넌트 생성
- [ ] 갤러리 아이템 클릭 시 모달 열기
- [ ] 큰 이미지/영상 프리뷰
- [ ] 작품 정보 표시 (제목, 설명, 태그, 스펙)
- [ ] "문의하기" 버튼
- [ ] ESC 키 / 외부 클릭으로 닫기

### 8. About 페이지 생성
- [ ] About 페이지 생성 (/about)
- [ ] LUMOS 브랜드 스토리
- [ ] STANDARD vs LOCAL 철학 설명
- [ ] AI 생성 기술 소개

### 9. Contact 페이지 생성
- [ ] Contact 페이지 생성 (/contact)
- [ ] 문의 폼 (이름, 이메일, 프로젝트 타입, 메시지)
- [ ] 제출 시 toast 메시지

---

## 🎯 Phase 4: 고급 기능 (나중에)

### 10. 반응형 디자인 개선
- [ ] 모바일 네비게이션 (햄버거 메뉴)
- [ ] 갤러리 그리드 반응형 (1열 → 2열 → 3열)
- [ ] 터치 제스처 최적화

### 11. SEO 최적화
- [ ] 메타 태그 추가
- [ ] Open Graph 이미지 설정
- [ ] robots.txt, sitemap.xml

---

## 📝 현재 상태

### ✅ 완료
- 기본 페이지 구조 (Home, STANDARD, LOCAL)
- Luminous Brutalism 디자인 시스템
- Hero 섹션 (애니메이션 배경)
- World Selection (50/50 분할)
- About 섹션 (Home 페이지)
- Footer

### ❌ 미완료
- 메가 메뉴 네비게이션
- 갤러리 필터 탭
- 콘텐츠 확장 (15-20개)
- Case Studies 섹션
- 작품 상세 모달
- About/Contact 페이지

---

## 🐛 버그 수정

### 긴급
- [ ] LocalWorld.tsx 파일 경로 오류 수정 (App.tsx import 문제)

---

## 📊 우선순위

1. **긴급 (오늘)**: 폰트, 가독성, 메가 메뉴 네비게이션
2. **중요 (내일)**: 갤러리 필터, 콘텐츠 확장, Case Studies
3. **추가 (다음주)**: 작품 모달, About, Contact
4. **나중에**: 반응형, SEO
