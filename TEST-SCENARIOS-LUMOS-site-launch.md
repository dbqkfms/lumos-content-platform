# Test Scenarios - LUMOS Site Launch

기준 스킬:
- `test-scenarios`

## Scenario 1. Home에서 서비스 이해

### Test Objective
방문자가 홈 첫 화면에서 LUMOS가 무엇인지와 THISGLOBAL와의 관계를 이해하는지 검증한다.

### Starting Conditions
- 사용자는 첫 방문자
- 데스크톱 또는 모바일 브라우저 사용
- 홈 페이지 로딩 가능

### User Role
- 잠재 고객 / 공간 운영자

### Test Steps
1. 홈 진입
2. 첫 화면 카피 확인
3. `FEATURED SCENES`, `WHO THIS IS FOR`, `DELIVERY / OPERATIONS`, `FAQ` 섹션 탐색
4. `Process` 진입

### Expected Outcomes
- LUMOS가 LED용 콘텐츠 라이브러리라는 점을 이해한다
- THISGLOBAL가 하드웨어/설치 쪽 역할이라는 점을 이해한다
- 사이트가 단순 갤러리가 아니라 제안/납품/운영 흐름을 가진다는 점을 이해한다

## Scenario 2. STANDARD / LOCAL 탐색

### Test Objective
방문자가 두 라인의 차이를 명확히 이해하고, 공간 목적에 맞는 쪽으로 이동하는지 검증한다.

### Starting Conditions
- 홈 접근 가능
- STANDARD / LOCAL 페이지 접근 가능

### User Role
- 호텔 / 리테일 / 전시 공간 담당자

### Test Steps
1. 홈에서 STANDARD 진입
2. 히어로 문장과 태그 칩 확인
3. 검색 및 상황 검색 영역 확인
4. 다시 홈으로 돌아와 LOCAL 진입
5. 동일하게 히어로 문장과 탐색 구조 확인

### Expected Outcomes
- STANDARD는 주인공형 콘텐츠, LOCAL은 배경형 콘텐츠로 이해된다
- 사용자는 자기 공간 목적에 맞는 라인을 선택할 수 있다

## Scenario 3. 작품 상세와 설치 시뮬레이션

### Test Objective
작품 상세가 감상용이 아니라 공간 적용 판단에 도움이 되는지 검증한다.

### Starting Conditions
- 작품 목록 접근 가능
- 상세 페이지 접근 가능

### User Role
- 영업팀 / 잠재 고객

### Test Steps
1. 작품 카드 클릭
2. 작품 상세의 기본 정보 확인
3. 설치 시뮬레이션 탭 확인
4. 하단 CTA와 Process 연결 확인

### Expected Outcomes
- 해상도, 루프, 태그 정보를 확인할 수 있다
- 설치 시뮬레이션이 실제 적용 상상을 돕는다
- 문의나 프로세스 확인으로 자연스럽게 이어진다

## Scenario 4. 문의 폼 상업용 적합성

### Test Objective
문의 폼이 실제 제안 준비에 필요한 정보를 충분히 수집하는지 검증한다.

### Starting Conditions
- 문의 모달 열기 가능

### User Role
- 잠재 고객

### Test Steps
1. 홈 또는 작품 상세에서 문의 버튼 클릭
2. 문의 유형 선택
3. 이름, 회사/공간명, 이메일 입력
4. 공간 유형, 화면 형태, 진행 시점 선택
5. 문의 내용 입력

### Expected Outcomes
- 영업팀이 후속 제안을 준비할 수 있는 수준의 정보가 수집된다
- 문의 유형에 따라 내부 라우팅이 가능하다

## Scenario 5. 모바일 탐색

### Test Objective
모바일에서 메뉴와 핵심 CTA가 잘리는지, 탐색 흐름이 유지되는지 검증한다.

### Starting Conditions
- 모바일 뷰포트

### User Role
- 모바일 사용자

### Test Steps
1. 홈 진입
2. 모바일 메뉴 열기
3. Standard / Local / Process 진입
4. 문의 버튼 접근

### Expected Outcomes
- 메뉴가 잘리지 않는다
- 모든 주요 페이지로 이동 가능하다
- 문의 버튼 접근이 유지된다
