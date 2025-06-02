import type { CircleProps, Renderer, RendererContext } from "./types";
import type { RenderUtils } from "./utils";

export class CircleRenderer implements Renderer<CircleProps> {
  private utils: RenderUtils;

  constructor(utils: RenderUtils) {
    this.utils = utils;
  }

  render(props: CircleProps, context: RendererContext) {
    const { cx, cy, r, color, style, strokeWidth } = props;
    const { getSurface } = context;
    const canvas = getSurface().getCanvas();

    // Check if gradient exists first
    const hasGradient = this.utils.hasGradientChildren(props);

    // Create paint with or without default color based on gradient presence
    const paint = hasGradient
      ? this.utils.createPaintWithoutColor({ style, strokeWidth })
      : this.utils.createPaint({ color, style, strokeWidth });

    // Apply gradient if exists
    if (hasGradient) {
      this.utils.applyGradientFromChildren(props, paint, {
        x: cx - r,
        y: cy - r,
        width: r * 2,
        height: r * 2,
      });
    }

    canvas.drawCircle(cx, cy, r, paint);

    paint.delete();
  }

  /**
   * Clean up resources
   * CircleRenderer doesn't hold persistent resources, cleanup is handled per-render
   */
  cleanup() {
    // No persistent resources to clean up
    // Paint objects are cleaned up immediately after use in render method
  }
}
