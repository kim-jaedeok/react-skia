import type { RenderProps, Renderer, RendererContext } from "./types";

export class GroupRenderer implements Renderer {
  private renderChildrenFn: (children: any, context: RendererContext) => void;

  constructor(
    renderChildrenFn: (children: any, context: RendererContext) => void,
  ) {
    this.renderChildrenFn = renderChildrenFn;
  }

  render(props: RenderProps, context: RendererContext): void {
    const { transform, opacity, children } = props;
    const { CanvasKit, canvas } = context;

    canvas.save();

    if (transform) {
      if (Array.isArray(transform)) {
        canvas.concat(transform);
      }
    }

    if (opacity !== undefined && opacity < 1) {
      const paint = new CanvasKit.Paint();
      paint.setAlphaf(opacity);
      canvas.saveLayer(paint);
      paint.delete();
    }

    if (children) {
      this.renderChildrenFn(children, context);
    }

    canvas.restore();
  }
}
