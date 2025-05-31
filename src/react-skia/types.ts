import type { ReactNode } from "react";

import type {
  CanvasKit,
  Font,
  Image,
  Paint,
  Path,
  Canvas as SkiaCanvas,
  Surface,
} from "canvaskit-wasm";

export interface SkiaElement {
  type: string;
  props: SkiaProps;
  children?: SkiaElement[];
}

export interface SkiaProps {
  [key: string]: any;
}

export interface SkiaDOMNode {
  type: string;
  props: SkiaProps;
  children: SkiaDOMNode[];
  draw: (canvas: SkiaCanvas) => void;
}

export interface ISkiaCanvas extends SkiaCanvas {}

export interface SkiaPaint extends Paint {}

export interface SkiaPath extends Path {}

export interface SkiaImage extends Image {}

export interface SkiaFont extends Font {}

export interface SkiaContextValue {
  CanvasKit: CanvasKit | null;
  surface: Surface | null;
  canvas: SkiaCanvas | null;
}

export interface DrawingProps {
  width: number;
  height: number;
  children?: ReactNode;
}

export interface RectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  strokeWidth?: number;
  style?: "fill" | "stroke";
}

export interface CircleProps {
  cx: number;
  cy: number;
  r: number;
  color?: string;
  strokeWidth?: number;
  style?: "fill" | "stroke";
}

export interface PathProps {
  path: string | SkiaPath;
  color?: string;
  strokeWidth?: number;
  style?: "fill" | "stroke";
}

export interface TextProps {
  x: number;
  y: number;
  text: string;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
}

export interface GroupProps {
  transform?: string | number[];
  opacity?: number;
  children?: ReactNode;
}

export interface BlurProps {
  blur: number;
  children?: ReactNode;
}

export interface ColorMatrixProps {
  matrix: number[];
  children?: ReactNode;
}

export interface ImageProps {
  x: number;
  y: number;
  width: number;
  height: number;
  src: string;
  fit?: "fill" | "contain" | "cover" | "none";
  opacity?: number;
}
