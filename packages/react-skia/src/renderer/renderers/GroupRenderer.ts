import type { ReactNode } from "react";

import type { GroupProps, Renderer, RendererContext } from "./types";

export class GroupRenderer implements Renderer<GroupProps> {
  private renderChildrenFn: (
    children: ReactNode,
    context: RendererContext,
  ) => void;

  constructor(
    renderChildrenFn: (children: ReactNode, context: RendererContext) => void,
  ) {
    this.renderChildrenFn = renderChildrenFn;
  }

  render(props: GroupProps, context: RendererContext) {
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

  /**
   * Clean up resources
   * GroupRenderer doesn't hold persistent resources, cleanup is handled per-render
   */
  cleanup() {
    // No persistent resources to clean up
    // Paint objects are cleaned up immediately after use in render method
  }
}
