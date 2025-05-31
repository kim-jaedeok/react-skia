import type { RenderProps, Renderer, RendererContext } from "./types";
import { RenderUtils } from "./utils";

export class RectRenderer implements Renderer {
  private utils: RenderUtils;

  constructor(utils: RenderUtils) {
    this.utils = utils;
  }

  render(props: RenderProps, context: RendererContext): void {
    const { x, y, width, height, color, style, strokeWidth } = props;
    const { CanvasKit, canvas } = context;

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
}
