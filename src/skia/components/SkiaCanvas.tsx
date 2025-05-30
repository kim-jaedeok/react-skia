import React, { useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Surface } from 'canvaskit-wasm';
import { useSkia } from '../providers/SkiaProvider';
import { SkiaRenderer } from '../renderer/SkiaRenderer';

interface SkiaCanvasProps {
  width: number;
  height: number;
  children?: ReactNode;
  style?: React.CSSProperties;
}

export function SkiaCanvas({ width, height, children, style }: SkiaCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const surfaceRef = useRef<Surface | null>(null);
  const { CanvasKit } = useSkia();

  useEffect(() => {
    if (!CanvasKit || !canvasRef.current) {
      return;
    }

    // Create surface using modern API
    const surface = CanvasKit.MakeSWCanvasSurface(canvasRef.current);
    if (!surface) {
      console.log('❌ Failed to create surface');
      return;
    }

    surfaceRef.current = surface;

    // Render children
    const canvas = surface.getCanvas();
    canvas.clear(CanvasKit.WHITE);

    if (children) {
      const renderer = new SkiaRenderer(CanvasKit);
      renderer.render(children, canvas);
    } else {
      console.log('🚫 No children to render');
    }

    surface.flush();

    return () => {
      if (surfaceRef.current) {
        surfaceRef.current.delete();
        surfaceRef.current = null;
      }
    };
  }, [CanvasKit, children, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        border: '1px solid #ccc',
        ...style,
      }}
    />
  );
}
