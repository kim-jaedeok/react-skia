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
  /**
   * The type of the Skia element
   */
  type: string;
  /**
   * Properties for the Skia element
   */
  props: SkiaProps;
  /**
   * Child elements
   */
  children?: SkiaElement[];
}

export interface SkiaProps {
  [key: string]: unknown;
  children?: ReactNode;
}

export interface SkiaDOMNode {
  /**
   * The type of the DOM node
   */
  type: string;
  /**
   * Properties for the DOM node
   */
  props: SkiaProps;
  /**
   * Child DOM nodes
   */
  children: SkiaDOMNode[];
  /**
   * Function to draw the node on canvas
   */
  draw: (canvas: SkiaCanvas) => void;
}

export type ISkiaCanvas = SkiaCanvas;

export type SkiaPaint = Paint;

export type SkiaPath = Path;

export type SkiaImage = Image;

export type SkiaFont = Font;

export interface SkiaContextValue {
  /**
   * The CanvasKit instance
   */
  CanvasKit: CanvasKit | null;
  /**
   * The Skia surface
   */
  surface: Surface | null;
  /**
   * The Skia canvas
   */
  canvas: SkiaCanvas | null;
}

export interface DrawingProps {
  /**
   * Width of the drawing area
   */
  width: number;
  /**
   * Height of the drawing area
   */
  height: number;
  /**
   * Child elements to render
   */
  children?: ReactNode;
}

/**
 * Properties for a rectangle element.
 */
export interface RectProps extends SkiaProps {
  /**
   * X-coordinate of the rectangle
   */
  x: number;
  /**
   * Y-coordinate of the rectangle
   */
  y: number;
  /**
   * Width of the rectangle
   */
  width: number;
  /**
   * Height of the rectangle
   */
  height: number;
  /**
   * Color of the rectangle
   */
  color?: string;
  /**
   * Stroke width of the rectangle
   */
  strokeWidth?: number;
  /**
   * Style of the rectangle, either 'fill' or 'stroke'
   */
  style?: "fill" | "stroke";
}

/**
 * Properties for a circle element.
 */
export interface CircleProps extends SkiaProps {
  /**
   * X-coordinate of the circle's center
   */
  cx: number;
  /**
   * Y-coordinate of the circle's center
   */
  cy: number;
  /**
   * Radius of the circle
   */
  r: number;
  /**
   * Color of the circle
   */
  color?: string;
  /**
   * Stroke width of the circle
   */
  strokeWidth?: number;
  /**
   * Style of the circle, either 'fill' or 'stroke'
   */
  style?: "fill" | "stroke";
}

/**
 * Properties for a path element.
 */
export interface PathProps extends SkiaProps {
  /**
   * Path data or SkiaPath object
   */
  path: string | SkiaPath;
  /**
   * Color of the path
   */
  color?: string;
  /**
   * Stroke width of the path
   */
  strokeWidth?: number;
  /**
   * Style of the path, either 'fill' or 'stroke'
   */
  style?: "fill" | "stroke";
}

/**
 * Properties for a text element.
 */
export interface TextProps extends SkiaProps {
  /**
   * X-coordinate of the text
   */
  x: number;
  /**
   * Y-coordinate of the text
   */
  y: number;
  /**
   * Text content
   */
  text: string;
  /**
   * Font size of the text
   */
  fontSize?: number;
  /**
   * Color of the text
   */
  color?: string;
  /**
   * Font family of the text
   */
  fontFamily?: string;
}

/**
 * Properties for a group element.
 */
export interface GroupProps extends SkiaProps {
  /**
   * Transformation applied to the group
   */
  transform?: string | number[];
  /**
   * Opacity of the group
   */
  opacity?: number;
  /**
   * Child elements within the group
   */
  children?: ReactNode;
}

/**
 * Properties for a blur effect element.
 */
export interface BlurProps extends SkiaProps {
  /**
   * Blur intensity
   */
  blur: number;
  /**
   * Child elements affected by the blur
   */
  children?: ReactNode;
}

/**
 * Properties for a color matrix effect element.
 */
export interface ColorMatrixProps extends SkiaProps {
  /**
   * Color matrix values
   */
  matrix: number[];
  /**
   * Child elements affected by the color matrix
   */
  children?: ReactNode;
}

/**
 * Properties for an image element.
 */
export interface ImageProps extends SkiaProps {
  /**
   * X-coordinate of the image
   */
  x: number;
  /**
   * Y-coordinate of the image
   */
  y: number;
  /**
   * Width of the image
   */
  width: number;
  /**
   * Height of the image
   */
  height: number;
  /**
   * Source URL of the image
   */
  src: string;
  /**
   * Fit style of the image
   */
  fit?: "fill" | "contain" | "cover" | "none";
  /**
   * Opacity of the image
   */
  opacity?: number;
}
