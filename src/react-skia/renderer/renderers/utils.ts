import { Children, isValidElement } from "react";

import type { CanvasKit, Paint } from "canvaskit-wasm";

import type {
  GradientBounds,
  LinearGradientProps,
  PaintOptions,
  RadialGradientProps,
} from "./types";

export class RenderUtils {
  private CanvasKit: CanvasKit;

  constructor(CanvasKit: CanvasKit) {
    this.CanvasKit = CanvasKit;
  }

  /**
   * Get the CanvasKit instance
   */
  getCanvasKit(): CanvasKit {
    return this.CanvasKit;
  }

  /**
   * Create paint with color and style options
   */
  createPaint(options: PaintOptions = {}): Paint {
    const { color = "#000000", style = "fill", strokeWidth = 1 } = options;

    const paint = new this.CanvasKit.Paint();
    const colorArray = this.CanvasKit.parseColorString(color);
    paint.setColor(colorArray);

    // Enable anti-aliasing for better quality
    paint.setAntiAlias(true);

    if (style === "stroke") {
      paint.setStyle(this.CanvasKit.PaintStyle.Stroke);
      paint.setStrokeWidth(strokeWidth);

      // Set stroke cap and join for better line quality
      paint.setStrokeCap(this.CanvasKit.StrokeCap.Round);
      paint.setStrokeJoin(this.CanvasKit.StrokeJoin.Round);
    } else {
      paint.setStyle(this.CanvasKit.PaintStyle.Fill);
    }

    return paint;
  }

  /**
   * Create paint without default color (for gradient usage)
   */
  createPaintWithoutColor(options: Omit<PaintOptions, "color"> = {}): Paint {
    const { style = "fill", strokeWidth = 1 } = options;

    const paint = new this.CanvasKit.Paint();

    // Enable anti-aliasing for better quality
    paint.setAntiAlias(true);

    if (style === "stroke") {
      paint.setStyle(this.CanvasKit.PaintStyle.Stroke);
      paint.setStrokeWidth(strokeWidth);

      // Set stroke cap and join for better line quality
      paint.setStrokeCap(this.CanvasKit.StrokeCap.Round);
      paint.setStrokeJoin(this.CanvasKit.StrokeJoin.Round);
    } else {
      paint.setStyle(this.CanvasKit.PaintStyle.Fill);
    }

    return paint;
  }

  /**
   * Check if props contain gradient children
   */
  hasGradientChildren(props: any): boolean {
    if (!props || !props.children) {
      return false;
    }

    let hasGradient = false;
    Children.forEach(props.children, child => {
      if (!isValidElement(child)) return;

      const { type } = child;

      if (typeof type === "string") {
        if (
          type === "skia-linear-gradient" ||
          type === "skia-radial-gradient"
        ) {
          hasGradient = true;
        }
      } else if (typeof type === "function") {
        // Check function component result
        try {
          let result;

          if (type.prototype && type.prototype.isReactComponent) {
            // Class component
            const instance = new (type as any)(child.props);
            result = instance.render();
          } else {
            // Function component
            result = (type as any)(child.props);
          }

          if (isValidElement(result)) {
            if (
              result.type === "skia-linear-gradient" ||
              result.type === "skia-radial-gradient"
            ) {
              hasGradient = true;
            }
          }
        } catch (error) {
          console.error("Error checking function component:", error);
        }
      }
    });

    return hasGradient;
  }

  /**
   * Apply gradient from children to paint
   */
  applyGradientFromChildren(
    props: any,
    paint: Paint,
    bounds?: GradientBounds,
  ): void {
    if (!props || !props.children) return;

    Children.forEach(props.children, child => {
      if (!isValidElement(child)) return;

      const { type } = child;
      const childProps = child.props as any;

      if (typeof type === "string") {
        if (type === "skia-linear-gradient") {
          this.applyLinearGradient(childProps, paint, bounds);
        } else if (type === "skia-radial-gradient") {
          this.applyRadialGradient(childProps, paint, bounds);
        }
      } else if (typeof type === "function") {
        try {
          let result;

          if (type.prototype && type.prototype.isReactComponent) {
            // Class component
            const instance = new (type as any)(childProps);
            result = instance.render();
          } else {
            // Function component
            result = (type as any)(childProps);
          }

          if (isValidElement(result)) {
            if (result.type === "skia-linear-gradient") {
              this.applyLinearGradient(result.props as any, paint, bounds);
            } else if (result.type === "skia-radial-gradient") {
              this.applyRadialGradient(result.props as any, paint, bounds);
            }
          }
        } catch (error) {
          console.error("Error executing function component:", error);
        }
      }
    });
  }

  /**
   * Apply linear gradient to paint
   */
  private applyLinearGradient(
    gradientProps: LinearGradientProps,
    paint: Paint,
    bounds?: GradientBounds,
  ): void {
    const { start, end, colors, positions, mode } = gradientProps;

    if (!start || !end || !Array.isArray(colors)) {
      console.error("Invalid gradient props:", { start, end, colors });
      return;
    }

    try {
      const colorArray = colors.map((color: string) => {
        const parsed = this.CanvasKit.parseColorString(color);
        return parsed;
      });

      let tileMode = this.CanvasKit.TileMode.Clamp;
      if (mode === "repeat") tileMode = this.CanvasKit.TileMode.Repeat;
      else if (mode === "mirror") tileMode = this.CanvasKit.TileMode.Mirror;
      else if (mode === "decal") tileMode = this.CanvasKit.TileMode.Decal;

      // Convert coordinates to absolute coordinates (if bounds provided)
      let gradientStart = [start.x, start.y];
      let gradientEnd = [end.x, end.y];

      if (bounds) {
        gradientStart = [bounds.x + start.x, bounds.y + start.y];
        gradientEnd = [bounds.x + end.x, bounds.y + end.y];
      }

      const shader = this.CanvasKit.Shader.MakeLinearGradient(
        gradientStart,
        gradientEnd,
        colorArray,
        positions || null,
        tileMode,
      );

      if (shader) {
        paint.setShader(shader);
        // Clean up shader immediately after setting it to paint
        shader.delete();
      } else {
        console.error("Failed to create shader");
      }
    } catch (error) {
      console.error("Error in applyLinearGradient:", error);
    }
  }

  /**
   * Apply radial gradient to paint
   */
  private applyRadialGradient(
    gradientProps: RadialGradientProps,
    paint: Paint,
    _bounds?: GradientBounds,
  ): void {
    const { center, radius, colors, positions, mode } = gradientProps;

    if (!center || radius === undefined || !Array.isArray(colors)) {
      return;
    }

    const colorArray = colors.map((color: string) =>
      this.CanvasKit.parseColorString(color),
    );

    let tileMode = this.CanvasKit.TileMode.Clamp;
    if (mode === "repeat") tileMode = this.CanvasKit.TileMode.Repeat;
    else if (mode === "mirror") tileMode = this.CanvasKit.TileMode.Mirror;
    else if (mode === "decal") tileMode = this.CanvasKit.TileMode.Decal;

    // RadialGradient uses relative coordinates as before
    const shader = this.CanvasKit.Shader.MakeRadialGradient(
      [center.x, center.y],
      radius,
      colorArray,
      positions || null,
      tileMode,
    );

    paint.setShader(shader);
    // Clean up shader immediately after setting it to paint
    shader.delete();
  }

  /**
   * Render non-gradient children
   */
  renderNonGradientChildren(
    props: any,
    renderElementFn: (child: any) => void,
  ): void {
    if (!props || !props.children) return;

    Children.forEach(props.children, child => {
      if (!isValidElement(child)) return;

      const { type } = child;

      // Render only non-gradient elements
      if (
        typeof type === "string" &&
        type !== "skia-linear-gradient" &&
        type !== "skia-radial-gradient"
      ) {
        renderElementFn(child);
      } else if (typeof type === "function") {
        // Function components are rendered
        renderElementFn(child);
      }
    });
  }

  /**
   * Clean up resources and references
   */
  cleanup(): void {
    // Clear any cached objects or references if they exist in the future
    // This method ensures proper cleanup of native resources
    // Note: Individual Paint, Shader, and other CanvasKit objects
    // should be cleaned up immediately after use in their respective methods
    // This cleanup is for any persistent references or caches
  }
}
