import type { ReactNode } from "react";

import type { ColorMatrixProps, Renderer, RendererContext } from "./types";

export class ColorMatrixRenderer implements Renderer<ColorMatrixProps> {
  private renderChildrenFn: (
    children: ReactNode,
    context: RendererContext,
  ) => void;

  constructor(
    renderChildrenFn: (children: ReactNode, context: RendererContext) => void,
  ) {
    this.renderChildrenFn = renderChildrenFn;
  }

  render(props: ColorMatrixProps, context: RendererContext) {
    const { matrix, children } = props;
    const { CanvasKit, getSurface } = context;
    const canvas = getSurface().getCanvas();

    canvas.save();

    const filter = CanvasKit.ColorFilter.MakeMatrix(matrix);
    const paint = new CanvasKit.Paint();
    paint.setColorFilter(filter);

    canvas.saveLayer(paint);

    if (children) {
      this.renderChildrenFn(children, context);
    }

    canvas.restore();
    paint.delete();
    filter.delete();
  }

  /**
   * Clean up resources
   * ColorMatrixRenderer doesn't hold persistent resources, cleanup is handled per-render
   */
  cleanup() {
    // No persistent resources to clean up
    // Paint and filter objects are cleaned up immediately after use in render method
  }
}
