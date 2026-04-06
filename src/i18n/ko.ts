import { Dictionary } from "./en";

export const ko: Dictionary = {
  sidebar: {
    search: "검색",
    projects: "프로젝트",
    new: "새 프로젝트",
    help: "도움말",
    archive: "보관된 항목"
  },
  header: {
    title: "WorMap Geospatial",
    explorer: "탐색 모드",
    projects: "프로젝트",
    assets: "에셋"
  },
  banner: {
    release: "최신 릴리스",
    title: "WorMap v4.0 경험하기",
    description: "다중 레이어 지형 등고선 처리 및 실시간 3D 지형 렌더링 도입. 대규모 기업용 공간 데이터 관리에 최적화되었습니다.",
    button: "레이어 탐색"
  },
  filters: {
    projects: "프로젝트",
    archived: "보관됨",
    filterBy: "필터 기준",
    ownerAll: "소유자: 전체",
    sort: "정렬",
    lastModified: "최근 수정일"
  },
  inventory: {
    title: "프로젝트 인벤토리",
    activeProjects: "{count}개의 활성 프로젝트",
    colName: "이름",
    colOwner: "소유자",
    colStorage: "사용 용량",
    colLastModified: "마지막 수정",
    colActions: "동작"
  },
  footer: {
    newProject: "새 프로젝트",
    systemOnline: "시스템 온라인",
    used: "사용됨",
    modifyKml: "로컬 KML 수정",
    lat: "위도",
    lon: "경도"
  },
  popovers: {
    notifications: "새로운 알림이 없습니다.",
    settings: "설정",
    profile: "프로필 메뉴",
    edit: "수정",
    delete: "삭제",
    share: "공유",
    changeLang: "Change to English"
  },
  loading: {
    title: "공간 데이터 동기화 중...",
    subtitle: "지형 및 메타데이터를 로드하고 있습니다.",
    tooltips: [
      "WorMap의 보행자는 날씨와 시간에 영향을 받습니다.",
      "차량의 트래픽 양은 시뮬레이션 설정에 따라 조절됩니다.",
      "밤이 되면 도시의 네온사인 기능이 활성화됩니다.",
      "워크뷰(Walk View) 모드에서 WASD 키로 이동할 수 있습니다."
    ]
  },
  explorer: {
    engine: "WorMap 엔진",
    title: "글로벌 탐색",
    search: "좌표 또는 장소 검색...",
    systemStatus: "시스템 상태",
    online: "온라인",
    travelTo: "{name} (으)로 이동",
    coordinates: "좌표"
  },
  scene: {
    info: {
      tag: "WorMap 라이브 씬",
      unknown: "알 수 없는 장소",
      discoveryMode: "탐색 모드",
      status: "상태",
      environment: "환경",
      localTime: "현지 시간",
      camera: "카메라",
      overview: "오버뷰",
      street: "스트리트"
    },
    status: {
      running: "실행 중",
      paused: "일시 정지"
    },
    weather: {
      clear: "맑음",
      cloudy: "흐림",
      rain: "비",
      snow: "눈"
    }
  }
};
