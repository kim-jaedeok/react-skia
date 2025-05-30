import { useCallback, useEffect, useRef } from 'react';
import type { Canvas, Surface } from 'canvaskit-wasm';
import { useSkia } from '../providers/SkiaProvider';

export function useDraw(drawFn: (canvas: Canvas) => void, deps: any[] = []) {
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
  }, [CanvasKit, drawFn, ...deps]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    return () => {
      if (surfaceRef.current) {
        surfaceRef.current.delete();
        surfaceRef.current = null;
      }
    };
  }, []);

  return { canvasRef, draw };
}
