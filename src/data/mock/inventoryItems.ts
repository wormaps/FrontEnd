import type { LucideIcon } from "lucide-react";
import { Map, Layers, Globe } from "lucide-react";

// ─── Project Type ──────────────────────────────────────────────────────────────

export type ProjectType = "map" | "layers" | "globe";

/**
 * 파일/프로젝트 타입별 아이콘 컴포넌트와 색상 클래스를 중앙화합니다.
 * JSX 엘리먼트를 데이터에 포함시키지 않고, 렌더 시 컴포넌트를 호출합니다.
 */
export const PROJECT_TYPE_META: Record<
  ProjectType,
  { icon: LucideIcon; colorClass: string }
> = {
  map: {
    icon: Map,
    colorClass: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  },
  layers: {
    icon: Layers,
    colorClass: "bg-orange-500/10 border-orange-500/20 text-orange-400",
  },
  globe: {
    icon: Globe,
    colorClass: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
  },
};

// ─── Mock Data ─────────────────────────────────────────────────────────────────

export type InventoryItem = {
  id: string;
  name: string;
  owner: string;
  /** 포맷된 파일 크기 문자열 (예: "14.2 MB") */
  size: string;
  /** 포맷된 날짜 문자열 (예: "2 mins ago") */
  date: string;
  link: string;
  type: ProjectType;
};

/**
 * 개발/데모용 mock 데이터입니다.
 * 실제 API 연동 시 이 배열을 제거하고 API 응답으로 교체하세요.
 */
export const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: "1",
    name: "Untitled Map",
    owner: "Me",
    size: "14.2 MB",
    date: "2 mins ago",
    link: "/explorer",
    type: "map",
  },
  {
    id: "2",
    name: "Urban Expansion Analysis",
    owner: "Team Alpha",
    size: "1.4 GB",
    date: "Yesterday, 4:12 PM",
    link: "/explorer",
    type: "layers",
  },
  {
    id: "3",
    name: "Grid Network Beta",
    owner: "Me",
    size: "84 KB",
    date: "Oct 24, 2023",
    link: "/explorer",
    type: "globe",
  },
];
