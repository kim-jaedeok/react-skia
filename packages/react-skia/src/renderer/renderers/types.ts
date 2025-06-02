import type { ReactNode } from "react";

import type { CanvasKit, Surface } from "canvaskit-wasm";

// Re-export types from the main types file
export type {
  CircleProps,
  RectProps,
  TextProps,
  ImageProps,
  PathProps,
  GroupProps,
  BlurProps,
  ColorMatrixProps,
  ComponentProps,
} from "../../types";

// Common types for all renderers
export interface RendererContext {
  /**
   * The CanvasKit instance for rendering
   */
  CanvasKit: CanvasKit;
  /**
   * @returns The current surface being rendered to
   */
  getSurface: () => Surface;
}

/**
 * Custom properties that can be passed to renderers
 * Used as default type parameter for Renderer interface
 */
interface RenderProps {
  /**
   * Custom properties that can be passed to renderers
   */
  [key: string]: unknown;
  /**
   * Child elements to be rendered
   */
  children?: ReactNode;
}

/**
 * Bounds interface for defining rectangular areas
 * Used by GradientBounds type alias
 */
interface Bounds {
  /**
   * X coordinate of the top-left corner
   */
  x: number;
  /**
   * Y coordinate of the top-left corner
   */
  y: number;
  /**
   * Width of the bounds
   */
  width: number;
  /**
   * Height of the bounds
   */
  height: number;
}

// Base interface for all renderers
export interface Renderer<TProps = RenderProps> {
  /**
   * Renders the element based on the provided props and context
   * @param props The properties to render with
   * @param context The rendering context containing CanvasKit and canvas
   */
  render(props: TProps, context: RendererContext): void;
  /**
   * Cleans up any resources used by the renderer
   */
  cleanup(): void;
}

// Paint creation options
export interface PaintOptions {
  /**
   * Color for the paint in CSS color format
   */
  color?: string;
  /**
   * Style of the paint - fill or stroke
   */
  style?: "fill" | "stroke";
  /**
   * Width of the stroke when style is "stroke"
   */
  strokeWidth?: number;
}

// Gradient types
/**
 * Bounds for a gradient
 */
export type GradientBounds = Bounds;

export interface LinearGradientProps {
  /**
   * Starting point of the gradient
   */
  start: { x: number; y: number };
  /**
   * Ending point of the gradient
   */
  end: { x: number; y: number };
  /**
   * Array of colors for the gradient
   */
  colors: string[];
  /**
   * Optional array of positions for each color (between 0 and 1)
   */
  positions?: number[];
  /**
   * Tile mode for how the gradient should behave outside its bounds
   */
  mode?: "clamp" | "repeat" | "mirror" | "decal";
}

export interface RadialGradientProps {
  /**
   * Center point of the radial gradient
   */
  center: { x: number; y: number };
  /**
   * Radius of the radial gradient
   */
  radius: number;
  /**
   * Array of colors for the gradient
   */
  colors: string[];
  /**
   * Optional array of positions for each color (between 0 and 1)
   */
  positions?: number[];
  mode?: "clamp" | "repeat" | "mirror" | "decal";
}
