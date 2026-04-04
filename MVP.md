# WorMap FE Guide

WorMap 프론트엔드는 **Next.js + Bun + Tailwind CSS** 기반으로 구성한다.

화면은 크게 3개로 나눈다.

* Globe Scene
* Loading / Transition Scene
* Place Scene

그리고 이 3개를 공통 상태 계층이 연결한다.

* Shared App State
* Place Runtime State
* Playback State

이 문서는 FE에서 어떤 기술을 쓰는지, 어떤 패키지가 필요한지, MVP에서 무엇까지 구현해야 하는지, 어떤 구조로 개발해야 하는지를 명확하게 정리한 문서이다.

---

# 1. FE 목표

프론트엔드는 단순히 3D 화면을 띄우는 역할이 아니다.
WorMap FE는 다음을 동시에 담당해야 한다.

1. 3D 지구본 탐색 경험 제공
2. 장소 선택 후 자연스러운 전환 제공
3. Place Scene 렌더링 및 제어
4. 시간 / 날씨 / 인파 / 차량 상태 재생
5. 탑뷰 / 워크뷰 전환
6. 배속 / 정지 / UI 인터랙션 제공

즉, FE는 **3D UI + Scene Player + Interaction Layer** 역할을 한다.

---

# 2. FE MVP 한 줄 정의

사용자가 3D 지구본에서 미리 등록된 장소를 선택하고, Loading Scene을 거쳐 해당 장소를 탑뷰와 워크뷰로 탐색하며, 시간과 날씨 상태를 재생할 수 있는 **Next.js 기반 웹 프론트엔드**.

---

# 3. FE MVP 조건

초기 MVP에서는 아래 범위까지만 구현한다.

## 포함

* 3D 지구본 렌더링
* 미리 등록된 장소 마커 표시
* 장소 클릭
* Loading / Transition Scene 전환
* Place Scene 렌더링
* 탑뷰 / 워크뷰 전환
* WASD 이동
* 낮 / 밤 반영
* 맑음 / 비 반영
* 재생 / 정지 / 배속
* 소규모 보행자 / 차량 움직임

## 제외

* 자유 장소 검색
* 유저 로그인
* 저장 기능
* AI 프롬프트 추천
* 실시간 교통 API 시각화
* 실제 인파 복원
* 장소 크기 동적 변경
* 모바일 최적화 완성본
* SEO 최적화 세부 작업
* 서버 액션 기반 고급 기능

---

# 4. FE 핵심 기술 스택

## 4-1. 기본 프레임워크

* Next.js
* React
* TypeScript
* Bun

## 4-2. 스타일링

* Tailwind CSS
* clsx
* cva(class-variance-authority) optional

## 4-3. 3D / Scene

* Three.js
* React Three Fiber
* @react-three/drei

## 4-4. 지구본

* CesiumJS
* Resium은 React 19 호환성 이슈가 안정화될 때까지 MVP에서 보류

## 4-5. 상태 관리

* Zustand

## 4-6. 서버 상태 / 데이터 패칭

* TanStack Query

## 4-7. 애니메이션 / 전환

* Framer Motion (React 19 호환 안정 버전 사용)
* GSAP optional

## 4-8. 유틸

* zod
* date-fns

---

# 5. 왜 이 스택을 쓰는가

## Next.js

WorMap은 단순 단일 페이지 3D 데모가 아니라, 이후 확장 시 다음이 붙을 가능성이 높다.

* 장소 상세 페이지
* 공유 가능한 URL
* 사용자 저장 기능
* API route 또는 BFF 구조
* 검색 / 목록 / 소개 페이지

그래서 처음부터 Vite보다 **확장 가능한 앱 구조**를 가진 Next.js가 더 적합하다.

## Bun

사용자는 Bun을 사용할 예정이며, 빠른 설치 / 실행 / 스크립트 관리 측면에서 개발 효율이 좋다.

## Tailwind CSS

HUD, 패널, 버튼, 로딩 UI, 툴팁, 플레이백 컨트롤 같은 일반 UI를 빠르게 만들기 좋다.

## Three.js + React Three Fiber

Place Scene은 일반 DOM이 아니라 3D 월드이기 때문에 Three.js가 필요하다.
하지만 Three.js만 직접 쓰면 UI와 상태 관리가 불편하므로 React Three Fiber로 React 구조 안에 묶는 것이 좋다.

## CesiumJS

지구본 탐색은 일반 3D 씬보다 geospatial globe가 더 중요하므로 Globe Scene은 Cesium이 더 적합하다.

## Zustand

카메라 모드, 현재 장소, 배속, 재생 여부, UI 상태를 가볍게 분리해서 관리하기 좋다.

## TanStack Query

백엔드에서 place metadata, snapshot, package info를 불러오는 로직을 캐시하기 좋다.

---

# 6. FE에서 실제로 사용할 패키지 목록

## 설치/실행 원칙 (Bun 고정)

* 패키지 설치는 `bun add` / `bun add -d`만 사용한다.
* 실행은 `bun run dev`, `bun run build`, `bun run lint`를 기본으로 한다.
* MVP 기간에는 npm/yarn/pnpm 스크립트 예시를 공식 명령으로 사용하지 않는다.

## 필수

```bash
bun add three @react-three/fiber @react-three/drei
bun add zustand @tanstack/react-query
bun add cesium
bun add clsx zod date-fns framer-motion
bun add class-variance-authority
bun add -d cpx2
```

### 버전 가이드 (MVP 기준)

* `@react-three/fiber`: v9 계열(React 19 대응)
* `@react-three/drei`: R3F v9와 호환되는 최신 안정 버전
* `framer-motion`: React 19 대응 최신 안정 버전
* `resium`: React 19 + Next App Router 조합 안정성 확인 전까지 설치하지 않는다.

### Cesium 운영 규칙 (Next.js App Router)

* Globe Scene은 client component로 분리한다.
* Cesium이 필요한 컴포넌트는 `dynamic(..., { ssr: false })`로 로딩한다.
* Cesium 정적 자산(Workers/Widgets/Assets)은 `public/cesium`에 복사해서 제공한다.
* `CESIUM_BASE_URL`을 브라우저 런타임에서 설정해 자산 경로를 고정한다.
* 필요 시 `.env.local`에 `NEXT_PUBLIC_CESIUM_TOKEN`을 사용한다.

## 개발 의존성 / 초기 생성 기준

```bash
bun create next-app
```

Next.js 생성 시 아래를 포함한다.

* TypeScript
* Tailwind CSS
* App Router
* src directory optional

## 선택

```bash
bun add gsap
bun add leva
bun add stats.js
```

### 선택 패키지 설명

* GSAP: 전환 연출이 더 복잡할 때 사용
* leva: 개발 중 scene debug panel 용도
* stats.js: FPS 확인용

### Cesium 자산 복사 스크립트 예시 (Bun)

```bash
bun add -d cpx2
```

```json
{
  "scripts": {
    "copy-cesium": "cpx \"node_modules/cesium/Build/Cesium/**\" public/cesium",
    "dev": "bun run copy-cesium && next dev",
    "build": "bun run copy-cesium && next build"
  }
}
```

---

# 7. Next.js 기준 화면 구조

## 7-1. Globe Scene

역할:

* 3D 지구본 렌더링
* 줌인 / 회전 / 이동
* 장소 마커 표시
* 장소 선택

핵심 포인트:

* 이 화면에서는 인파, 차량, 날씨 시뮬레이션을 하지 않는다.
* 여기는 탐색 레이어다.

추천 경로:

* `/`

## 7-2. Loading / Transition Scene

역할:

* Globe → Place 전환
* 장면 준비 상태 표시
* 툴팁 및 로딩 UI 표시

핵심 포인트:

* 단순 스피너가 아니라 진입 연출을 담당한다.
* Place package preload가 끝날 때까지 사용자에게 기다림을 자연스럽게 보여준다.

추천 방식:

* route transition state
* 또는 `/place/[slug]` 진입 시 loading UI

## 7-3. Place Scene

역할:

* 장소 렌더링
* 탑뷰 표시
* 워크뷰 표시
* 시간 / 날씨 / 인파 / 차량 재생
* 배속 / 정지 / 전환 UI

핵심 포인트:

* WorMap의 본체는 Place Scene이다.

추천 경로:

* `/place/[slug]`

---

# 8. FE 폴더 구조 제안 (Next.js App Router 기준)

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    place/
      [slug]/
        page.tsx
        loading.tsx

  components/
    ui/
    hud/
    shared/

  features/
    globe/
    loading/
    place/
    playback/
    camera/

  scene/
    place/
      PlaceScene.tsx
      PlaceSceneManager.ts
      controllers/
      systems/
      components/
      effects/
      assets/

  globe/
    GlobeScene.tsx
    GlobeMarkers.tsx

  services/
    api/
      places.ts
      snapshots.ts
      scenePackage.ts

  stores/
    appStore.ts
    globeStore.ts
    placeStore.ts
    playbackStore.ts

  types/
    place.ts
    snapshot.ts
    world.ts
    scene.ts

  utils/
```

---

# 9. FE 상태 관리 구조

## appStore

전역 화면 상태

* currentMode: globe | loading | place
* selectedPlaceId
* loadingProgress

## globeStore

지구본 상태

* currentCameraPosition
* zoomLevel
* visibleMarkers
* hoveredMarker

## placeStore

Place Scene 상태

* place metadata
* package metadata
* currentViewMode: top | walk
* isSceneReady

## playbackStore

재생 상태

* currentTime
* isPlaying
* speed
* weatherMode

---

# 10. FE가 받아야 하는 백엔드 데이터

## 10-1. Place List

Globe에 표시할 장소 목록

필드 예시:

* id
* name
* lat
* lng
* country
* city
* thumbnailUrl
* category

## 10-2. Place Detail / Package Info

Place Scene 진입에 필요한 정보

필드 예시:

* scene source
* bounds
* camera preset
* walk start point
* nav source
* metadata

## 10-3. Scene Snapshot

특정 시간의 동적 상태

필드 예시:

* isNight
* weather
* pedestrianLevel
* vehicleLevel
* umbrellaRatio
* roadWetness
* neonEnabled

---

# 11. Place Scene 내부 구조

Place Scene은 다음 레이어로 분리한다.

## Static Environment Layer

* 건물
* 도로
* 바닥
* 랜드마크 기본 구조

## Navigation Layer

* navmesh
* walk path
* vehicle path
* spawn point

## Dynamic Simulation Layer

* pedestrian agents
* vehicle agents
* signal state
* landmark state

## Effects Layer

* 비
* 안개
* 조명
* 바닥 반사
* 밤 연출

## Camera Layer

* top view camera
* walk view camera

---

# 12. FE 최소 로직 조건

## 12-1. Globe Scene 최소 조건

* 지구본이 렌더링되어야 한다.
* 장소 마커가 3개 이상 표시되어야 한다.
* 클릭 시 place id를 얻을 수 있어야 한다.

## 12-2. Loading Scene 최소 조건

* 로딩 중 상태를 보여줘야 한다.
* place package preload 완료 여부를 알 수 있어야 한다.

## 12-3. Place Scene 최소 조건

* 정적 장소 구조가 보여야 한다.
* 탑뷰 카메라가 작동해야 한다.
* 워크뷰 카메라가 작동해야 한다.
* 낮 / 밤 전환이 보여야 한다.
* 비 연출이 들어가야 한다.
* 보행자와 차량이 소규모로 움직여야 한다.
* 재생 / 정지 / 배속이 작동해야 한다.

---

# 13. FE 개발 순서

## Phase 1. Globe MVP

* Cesium 지구본 렌더링
* 장소 마커 표시
* place 클릭 이벤트

## Phase 2. Place MVP

* Place Scene 기본 렌더링
* 탑뷰 / 워크뷰 전환
* 정적 장소 로드

## Phase 3. Loading 연결

* Globe → Loading → Place 전환 연결

## Phase 4. 시간 / 날씨 반영

* 낮 / 밤 전환
* 비 연출
* 배속 / 정지 구현

## Phase 5. 이동 요소 추가

* pedestrian 소규모 추가
* vehicle 소규모 추가

## Phase 6. 다듬기

* HUD
* 툴팁
* 전환 연출
* 성능 보정

---

# 14. FE 성능 원칙

## 원칙 1. Globe와 Place는 같은 씬으로 만들지 않는다

지구본과 장소는 서로 다른 렌더링 단계로 분리한다.

## 원칙 2. 사람 수를 처음부터 많이 두지 않는다

처음에는 10~20명 수준으로 제한한다.

## 원칙 3. 차량도 소규모 path 기반으로만 시작한다

진짜 차량 AI까지 처음부터 구현하지 않는다.

## 원칙 4. Place Scene은 고정 bounds를 가진다

장소마다 렌더 범위를 늘리지 않는다.

## 원칙 5. 렌더링 품질은 탑뷰와 워크뷰를 다르게 가져간다

탑뷰는 전체 흐름, 워크뷰는 근거리 체험 중심으로 나눈다.

## 원칙 6. Next.js를 쓴다고 SSR에 집착하지 않는다

Globe Scene과 Place Scene은 브라우저 전용 처리 비중이 크므로 client component 기준으로 설계한다.

---

# 15. FE 개발 시 주의점

## 주의 1. 사람 / 차량 좌표를 React state로 계속 관리하지 않는다

실시간 위치 갱신은 scene controller나 내부 시스템에서 관리한다.

## 주의 2. 날씨 데이터를 그대로 시각화하지 않는다

날씨 API 값은 렌더링 파라미터로 변환해서 사용한다.

## 주의 3. Place Scene에서 모든 것을 한 컴포넌트에 몰아넣지 않는다

* camera controller
* weather controller
* crowd controller
* vehicle controller
  를 나눠야 한다.

## 주의 4. MVP에서는 자동 scene build까지 욕심내지 않는다

프론트는 우선 package 또는 scene data를 잘 소비하는 데 집중한다.

## 주의 5. Cesium과 R3F를 한 렌더 트리에 억지로 묶지 않는다

Globe Scene과 Place Scene은 화면 단계로 분리해서 관리한다.

---

# 16. FE 최종 목표

WorMap FE의 목표는 단순히 3D 화면을 띄우는 것이 아니다.

최종적으로는:

* 사용자가 지구본을 탐색하고
* 특정 장소에 진입하고
* 시간과 날씨가 반영된 장소를
* 탑뷰와 워크뷰로 체험할 수 있게 만드는 것

즉 WorMap FE는 **3D 지구본 탐색기 + 장소 시뮬레이션 플레이어**를 만드는 작업이다.
