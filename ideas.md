# LUMOS 웹사이트 디자인 아이디어 브레인스토밍

## 디자인 철학

LUMOS는 LED 디스플레이 전용 AI 생성 미디어아트 라이브러리로, "빛으로 공간의 정체성을 완성"하는 브랜드입니다. 웹사이트는 이 철학을 시각적으로 구현해야 하며, STANDARD(프리미엄)와 LOCAL(상업용)의 이원화된 세계를 명확하게 전달해야 합니다.

---

<response>
<probability>0.08</probability>
<text>

## Idea 1: "Luminous Brutalism" - 빛의 잔혹주의

### Design Movement
**Neo-Brutalism meets Light Art** - 거친 구조적 요소와 섬세한 빛의 대비. 콘크리트의 무게감과 빛의 무게 없음이 충돌하는 미학.

### Core Principles
1. **Structural Honesty**: 레이아웃의 구조를 숨기지 않고 드러냄. 그리드 라인, 섹션 경계가 시각적 요소로 작용
2. **Light as Material**: 빛을 장식이 아닌 물질적 요소로 취급. 그림자, 글로우, 블러가 공간을 정의
3. **Asymmetric Tension**: 비대칭 레이아웃으로 긴장감 조성. 60/40, 70/30 분할로 시선 유도
4. **Monochromatic Drama**: 블랙, 화이트, 골드 3색만 사용. 색상이 아닌 명도와 채도로 계층 구축

### Color Philosophy
- **STANDARD**: 순수 블랙(#000000) 배경 + 메탈릭 골드(#D4AF37) 액센트. 빛이 어둠을 찢고 나오는 느낌
- **LOCAL**: 오프화이트(#F5F5DC) 배경 + 웜 그레이(#A8A8A8) 텍스트. 부드러운 자연광 느낌
- **감정적 의도**: STANDARD는 "경외감", LOCAL은 "안정감"

### Layout Paradigm
**Fragmented Grid System** - 전통적 그리드를 의도적으로 파괴. 섹션마다 다른 그리드 시스템 적용.
- Hero: 풀스크린 영상 + 좌측 하단 텍스트 (10% 영역)
- World Selection: Vertical Split (정확히 50/50, 중앙 1px 골드 라인)
- Gallery: Masonry 레이아웃 (높이 불규칙, 리듬감 조성)

### Signature Elements
1. **Glowing Dividers**: 섹션 구분선이 빛남. 1px 골드 라인 + 20px 블러
2. **Offset Typography**: 텍스트가 컨테이너를 벗어남. 제목의 일부가 화면 밖으로
3. **Light Trails**: 스크롤 시 빛의 궤적이 남음. GSAP로 구현

### Interaction Philosophy
**Heavy but Responsive** - 무거운 비주얼이지만 인터랙션은 즉각적. 호버 시 0.2초 이내 반응. 클릭은 촉각적 피드백 (스케일 다운 → 업)

### Animation
- **Entrance**: 요소가 아래에서 위로 슬라이드 + 페이드인 (0.8초, ease-out)
- **Scroll**: Parallax 효과 (배경 영상 느리게, 텍스트 빠르게)
- **Transition**: 페이지 전환 시 빛이 화면을 가로지름 (Wipe 효과)

### Typography System
- **Display**: "Playfair Display" Bold 700 (제목, 브랜드명) - 클래식하고 권위적
- **Body**: "Inter" Regular 400 (본문) - 중립적이고 가독성 높음
- **Accent**: "Space Grotesk" Medium 500 (CTA, 라벨) - 기하학적이고 현대적
- **계층**: H1(72px) → H2(48px) → H3(32px) → Body(16px) → Small(14px)
- **Line Height**: Display 1.1, Body 1.6 (가독성과 밀도의 균형)

</text>
</response>

---

<response>
<probability>0.07</probability>
<text>

## Idea 2: "Ethereal Minimalism" - 공기 같은 미니멀리즘

### Design Movement
**Japanese Ma (間) + Swiss Minimalism** - 비어있음의 미학과 정밀한 타이포그래피. 공간이 주인공.

### Core Principles
1. **Negative Space Dominance**: 화면의 70%는 비어있음. 콘텐츠는 작고 정밀하게 배치
2. **Breath and Pause**: 섹션 간 여백이 화면 높이의 2배. 스크롤이 명상적 경험
3. **Precision Typography**: 텍스트 정렬이 픽셀 단위로 정확. 베이스라인 그리드 엄격히 준수
4. **Subtle Motion**: 애니메이션은 거의 보이지 않음. 0.3초 이내, 5px 이내 움직임

### Color Philosophy
- **STANDARD**: 다크 그레이(#1A1A1A) 배경 + 퓨어 화이트(#FFFFFF) 텍스트. 골드는 단 하나의 CTA에만
- **LOCAL**: 라이트 베이지(#FAF9F6) 배경 + 차콜(#2C2C2C) 텍스트. 색상 없음
- **감정적 의도**: "고요함", "집중", "명료함"

### Layout Paradigm
**Center-Aligned Minimalism** - 모든 콘텐츠가 중앙 정렬. 최대 너비 600px. 좌우 여백 최소 20%.
- Hero: 중앙 텍스트 + 배경 영상 (투명도 30%)
- World Selection: 수직 스택 (STANDARD 위, LOCAL 아래, 각 100vh)
- Gallery: 단일 컬럼 (이미지 하나씩, 스크롤로 탐색)

### Signature Elements
1. **Hairline Borders**: 0.5px 라인. 거의 보이지 않지만 구조 제공
2. **Floating Cards**: 카드가 배경에서 2px만 떠있음. 그림자 없음, 보더만
3. **Breathing Animation**: 요소가 천천히 커졌다 작아짐 (5초 주기, 2% 스케일 변화)

### Interaction Philosophy
**Invisible Until Needed** - 인터랙티브 요소가 기본적으로 숨겨짐. 호버 시에만 나타남. 마우스 추적 없음.

### Animation
- **Entrance**: 페이드인만 (1초, linear)
- **Scroll**: 패럴랙스 없음. 단순 스크롤
- **Transition**: 크로스 페이드 (0.5초)

### Typography System
- **Display**: "Cormorant Garamond" Light 300 (제목) - 우아하고 섬세
- **Body**: "IBM Plex Sans" Regular 400 (본문) - 중립적이고 기하학적
- **Mono**: "IBM Plex Mono" Regular 400 (라벨, 메타데이터) - 정밀하고 기술적
- **계층**: H1(64px) → H2(40px) → H3(24px) → Body(18px) → Small(14px)
- **Line Height**: 모든 텍스트 1.8 (여유로운 호흡)

</text>
</response>

---

<response>
<probability>0.09</probability>
<text>

## Idea 3: "Kinetic Opulence" - 운동하는 화려함

### Design Movement
**Art Deco meets Motion Graphics** - 1920년대 기하학적 화려함과 현대적 모션 디자인. 움직임이 장식.

### Core Principles
1. **Geometric Luxury**: 기하학적 패턴이 배경과 전경 모두에. 육각형, 아치, 방사형
2. **Layered Depth**: 최소 5개 레이어. 전경, 중경, 배경, 파티클, 글로우
3. **Constant Motion**: 화면의 모든 요소가 미세하게 움직임. 정지된 것이 없음
4. **Metallic Richness**: 골드, 브론즈, 실버의 그라데이션. 메탈릭 텍스처

### Color Philosophy
- **STANDARD**: 딥 네이비(#0A1128) + 골드 그라데이션(#D4AF37 → #FFD700). 밤하늘의 별
- **LOCAL**: 크림(#FFF8E7) + 브론즈(#CD7F32). 따뜻한 오후 햇살
- **감정적 의도**: STANDARD는 "사치", LOCAL은 "풍요"

### Layout Paradigm
**Radial Composition** - 중심에서 방사형으로 확장. 전통적 그리드 거부.
- Hero: 중앙 로고에서 빛이 방사. 텍스트는 원형 배치
- World Selection: 대각선 분할 (45도 각도, 골드 라인)
- Gallery: 육각형 그리드 (Honeycomb 레이아웃)

### Signature Elements
1. **Particle Systems**: 배경에 떠다니는 골드 파티클 (Canvas API)
2. **Geometric Frames**: 콘텐츠를 감싸는 장식적 기하학 프레임
3. **Light Rays**: 중심에서 퍼지는 빛줄기 (SVG + CSS 애니메이션)

### Interaction Philosophy
**Theatrical Response** - 모든 인터랙션이 과장됨. 호버 시 스케일 1.1배, 그림자 확장, 파티클 폭발.

### Animation
- **Entrance**: 회전하며 등장 (360도, 1초, ease-in-out)
- **Scroll**: 요소가 시차를 두고 등장. 스태거 애니메이션 (0.1초 간격)
- **Transition**: 페이지가 큐브처럼 회전하며 전환 (3D transform)

### Typography System
- **Display**: "Bodoni Moda" Bold 700 (제목) - 극적이고 고급스러움
- **Body**: "Montserrat" Regular 400 (본문) - 기하학적이고 현대적
- **Accent**: "Cinzel" SemiBold 600 (CTA, 특별 텍스트) - 로마 비문 스타일
- **계층**: H1(96px) → H2(64px) → H3(40px) → Body(16px) → Small(12px)
- **Line Height**: Display 1.0 (타이트), Body 1.5 (균형)
- **특징**: 제목에 Letter Spacing 0.05em (여유로운 간격)

</text>
</response>

---

## 선택된 디자인 방향: Idea 1 - "Luminous Brutalism"

### 선택 이유
1. **브랜드 정체성 부합**: "빛으로 공간의 정체성을 완성"이라는 LUMOS의 철학을 가장 직접적으로 표현
2. **이원화 구조 강조**: STANDARD/LOCAL의 극명한 대비를 시각적으로 효과적으로 전달
3. **차별화**: 일반적인 미디어아트 갤러리 사이트와 차별화된 독특한 아이덴티티
4. **기술적 실현 가능성**: GSAP, Tailwind CSS로 구현 가능한 현실적인 디자인

### 구현 방향
- **Typography**: Playfair Display (Display), Inter (Body), Space Grotesk (Accent)
- **Color**: STANDARD (Black + Gold), LOCAL (Off-White + Warm Gray)
- **Layout**: Fragmented Grid, Vertical Split, Masonry
- **Animation**: GSAP ScrollTrigger, Light Trails, Glowing Dividers
- **Interaction**: Heavy but Responsive, Tactile Feedback
