import type { RenderProps, Renderer, RendererContext } from "./types";

export class ColorMatrixRenderer implements Renderer {
  private renderChildrenFn: (children: any, context: RendererContext) => void;

  constructor(
    renderChildrenFn: (children: any, context: RendererContext) => void,
  ) {
    this.renderChildrenFn = renderChildrenFn;
  }

  render(props: RenderProps, context: RendererContext): void {
    const { matrix, children } = props;
    const { CanvasKit, canvas } = context;

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
  cleanup(): void {
    // No persistent resources to clean up
    // Paint and filter objects are cleaned up immediately after use in render method
  }
}
