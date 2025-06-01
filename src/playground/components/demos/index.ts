import type { DemoItem } from "../Sidebar";
import { BasicShapes } from "./BasicShapes";
import { ComplexScene } from "./ComplexScene";
import { GradientEffects } from "./GradientEffects";
import { GroupAndOpacity } from "./GroupAndOpacity";
import { ImageRendering } from "./ImageRendering";
import { InteractiveDemo } from "./InteractiveDemo";
import { PathDrawing } from "./PathDrawing";
import { PerformanceTest } from "./PerformanceTest";
import { ProjectStatus } from "./ProjectStatus";
import { TextRendering } from "./TextRendering";

export const DEMO_ITEMS: DemoItem[] = [
  {
    id: "basic-shapes",
    title: "기본 도형",
    icon: "🔸",
    description: "사각형, 원, 스트로크",
    Component: BasicShapes,
  },
  {
    id: "text-rendering",
    title: "텍스트 렌더링",
    icon: "📝",
    description: "폰트 및 텍스트 처리",
    Component: TextRendering,
  },
  {
    id: "path-drawing",
    title: "패스 그리기",
    icon: "🎨",
    description: "SVG 호환 패스",
    Component: PathDrawing,
  },
  {
    id: "group-opacity",
    title: "그룹 및 투명도",
    icon: "👥",
    description: "레이어링 및 투명도",
    Component: GroupAndOpacity,
  },
  {
    id: "complex-scene",
    title: "복합 그래픽",
    icon: "🏞",
    description: "복잡한 장면 렌더링",
    Component: ComplexScene,
  },
  {
    id: "performance-test",
    title: "성능 테스트",
    icon: "🚀",
    description: "100개 원 렌더링",
    Component: PerformanceTest,
  },
  {
    id: "interactive",
    title: "상호작용",
    icon: "🎮",
    description: "터치/클릭 이벤트",
    Component: InteractiveDemo,
  },
  {
    id: "gradient-effects",
    title: "그라디언트 효과",
    icon: "🌈",
    description: "선형/원형 그라디언트",
    Component: GradientEffects,
  },
  {
    id: "image-rendering",
    title: "이미지 렌더링",
    icon: "🖼️",
    description: "이미지 로딩 및 표시",
    Component: ImageRendering,
  },
  {
    id: "project-status",
    title: "프로젝트 현황",
    icon: "📊",
    description: "구현 상태 및 정보",
    Component: ProjectStatus,
  },
];
