import type { ReactNode } from "react";

import type { BlurProps, Renderer, RendererContext } from "./types";

export class BlurRenderer implements Renderer<BlurProps> {
  private renderChildrenFn: (
    children: ReactNode,
    context: RendererContext,
  ) => void;

  constructor(
    renderChildrenFn: (children: ReactNode, context: RendererContext) => void,
  ) {
    this.renderChildrenFn = renderChildrenFn;
  }

  render(props: BlurProps, context: RendererContext) {
    const { blur, children } = props;
    const { CanvasKit, getSurface } = context;
    const canvas = getSurface().getCanvas();

    canvas.save();

    const filter = CanvasKit.ImageFilter.MakeBlur(
      blur,
      blur,
      CanvasKit.TileMode.Clamp,
      null,
    );
    const paint = new CanvasKit.Paint();
    paint.setImageFilter(filter);

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
   * BlurRenderer doesn't hold persistent resources, cleanup is handled per-render
   */
  cleanup() {
    // No persistent resources to clean up
    // Paint and filter objects are cleaned up immediately after use in render method
  }
}
