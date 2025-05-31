import type { RenderProps, Renderer, RendererContext } from "./types";

export class BlurRenderer implements Renderer {
  private renderChildrenFn: (children: any, context: RendererContext) => void;

  constructor(
    renderChildrenFn: (children: any, context: RendererContext) => void,
  ) {
    this.renderChildrenFn = renderChildrenFn;
  }

  render(props: RenderProps, context: RendererContext): void {
    const { blur, children } = props;
    const { CanvasKit, canvas } = context;

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
}
