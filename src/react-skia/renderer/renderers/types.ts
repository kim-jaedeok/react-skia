import type { ReactNode } from "react";

import type { Canvas, CanvasKit } from "canvaskit-wasm";

// Common types for all renderers
export interface RendererContext {
  CanvasKit: CanvasKit;
  canvas: Canvas;
}

export interface RenderProps {
  [key: string]: any;
  children?: ReactNode;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Base interface for all renderers
export interface Renderer {
  render(props: RenderProps, context: RendererContext): void;
  cleanup(): void;
}

// Paint creation options
export interface PaintOptions {
  color?: string;
  style?: "fill" | "stroke";
  strokeWidth?: number;
}

// Gradient types
export interface GradientBounds extends Bounds {}

export interface LinearGradientProps {
  start: { x: number; y: number };
  end: { x: number; y: number };
  colors: string[];
  positions?: number[];
  mode?: "clamp" | "repeat" | "mirror" | "decal";
}

export interface RadialGradientProps {
  center: { x: number; y: number };
  radius: number;
  colors: string[];
  positions?: number[];
  mode?: "clamp" | "repeat" | "mirror" | "decal";
}
