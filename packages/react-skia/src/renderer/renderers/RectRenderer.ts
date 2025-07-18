import type { RectProps, Renderer, RendererContext } from "./types";
import type { RenderUtils } from "./utils";

export class RectRenderer implements Renderer<RectProps> {
  private utils: RenderUtils;

  constructor(utils: RenderUtils) {
    this.utils = utils;
  }

  render(props: RectProps, context: RendererContext) {
    const { x, y, width, height, color, style, strokeWidth } = props;
    const { CanvasKit, getSurface } = context;
    const canvas = getSurface().getCanvas();

    // Check if gradient exists first
    const hasGradient = this.utils.hasGradientChildren(props);

    // Create paint with or without default color based on gradient presence
    const paint = hasGradient
      ? this.utils.createPaintWithoutColor({ style, strokeWidth })
      : this.utils.createPaint({ color, style, strokeWidth });

    // Apply gradient if exists (pass rendering coordinates)
    if (hasGradient) {
      this.utils.applyGradientFromChildren(props, paint, {
        x,
        y,
        width,
        height,
      });
    }

    const rect = CanvasKit.XYWHRect(x, y, width, height);
    canvas.drawRect(rect, paint);

    paint.delete();
  }

  /**
   * Clean up resources
   * RectRenderer doesn't hold persistent resources, cleanup is handled per-render
   */
  cleanup() {
    // No persistent resources to clean up
    // Paint objects are cleaned up immediately after use in render method
  }
}
