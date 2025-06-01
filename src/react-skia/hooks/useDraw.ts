import { useCallback, useEffect, useRef } from "react";

import type { Canvas, Surface } from "canvaskit-wasm";

import { useSkia } from "./useSkia";

export const useDraw = (drawFn: (canvas: Canvas) => void) => {
  const { CanvasKit } = useSkia();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const surfaceRef = useRef<Surface | null>(null);

  const draw = useCallback(() => {
    if (!CanvasKit || !canvasRef.current) return;

    if (!surfaceRef.current) {
      surfaceRef.current = CanvasKit.MakeSWCanvasSurface(canvasRef.current);
    }

    const surface = surfaceRef.current;
    if (!surface) return;

    const canvas = surface.getCanvas();
    canvas.clear(CanvasKit.WHITE);

    drawFn(canvas);

    surface.flush();
  }, [CanvasKit, drawFn]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(
    () => () => {
      if (surfaceRef.current) {
        surfaceRef.current.delete();
        surfaceRef.current = null;
      }
    },
    [],
  );

  return { canvasRef, draw };
};
