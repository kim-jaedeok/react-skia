import type { Path } from "canvaskit-wasm";

import type { RenderProps, Renderer, RendererContext } from "./types";
import { RenderUtils } from "./utils";

export class PathRenderer implements Renderer {
  private utils: RenderUtils;

  constructor(utils: RenderUtils) {
    this.utils = utils;
  }

  render(props: RenderProps, context: RendererContext): void {
    const { path, color, style, strokeWidth } = props;
    const { CanvasKit, canvas } = context;

    const paint = this.utils.createPaint({ color, style, strokeWidth });

    // Apply gradient from children
    this.utils.applyGradientFromChildren(props, paint);

    let skiaPath: Path | null;
    if (typeof path === "string") {
      skiaPath = CanvasKit.Path.MakeFromSVGString(path);
    } else {
      skiaPath = path;
    }

    if (skiaPath) {
      canvas.drawPath(skiaPath, paint);
      if (typeof path === "string") {
        skiaPath.delete();
      }
    }

    paint.delete();
  }
}
