import type { Path } from "canvaskit-wasm";

import type { PathProps, Renderer, RendererContext } from "./types";
import type { RenderUtils } from "./utils";

export class PathRenderer implements Renderer<PathProps> {
  private utils: RenderUtils;

  constructor(utils: RenderUtils) {
    this.utils = utils;
  }

  render(props: PathProps, context: RendererContext) {
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

  /**
   * Clean up resources
   * PathRenderer doesn't hold persistent resources, cleanup is handled per-render
   */
  cleanup() {
    // No persistent resources to clean up
    // Paint and path objects are cleaned up immediately after use in render method
  }
}
