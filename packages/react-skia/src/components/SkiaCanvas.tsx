import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

import type { Surface } from "canvaskit-wasm";

import { useSkia } from "../hooks/useSkia";
import { SkiaRenderer } from "../renderer/SkiaRenderer";

interface SkiaCanvasProps {
  width: number;
  height: number;
  children?: ReactNode;
  style?: CSSProperties;
}

export const SkiaCanvas = ({
  width,
  height,
  children,
  style,
}: SkiaCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const surfaceRef = useRef<Surface | null>(null);
  const rendererRef = useRef<SkiaRenderer | null>(null);
  const { CanvasKit } = useSkia();
  useEffect(() => {
    if (!CanvasKit || !canvasRef.current) {
      return;
    }

    // Get device pixel ratio for high-DPI displays
    const pixelRatio = window.devicePixelRatio || 1;
    const canvasElement = canvasRef.current;

    // Set actual canvas size for high resolution
    canvasElement.width = width * pixelRatio;
    canvasElement.height = height * pixelRatio;

    // Scale canvas back to original size via CSS
    canvasElement.style.width = `${width}px`;
    canvasElement.style.height = `${height}px`;

    // Create surface using modern API with high-DPI support
    const surface = CanvasKit.MakeSWCanvasSurface(canvasElement);
    if (!surface) {
      console.error("Failed to create surface");
      return;
    }

    surfaceRef.current = surface;

    // Create renderer instance and store reference for cleanup
    const renderer = new SkiaRenderer(CanvasKit);
    rendererRef.current = renderer;

    // Render children
    const canvas = surface.getCanvas();

    // Scale the drawing context for high-DPI
    canvas.scale(pixelRatio, pixelRatio);
    canvas.clear(CanvasKit.WHITE);

    if (children) {
      renderer.render(children, canvas);
    } else {
      console.error("No children to render");
    }

    surface.flush();

    return () => {
      // Clean up renderer first
      if (rendererRef.current) {
        // Call cleanup method if renderer has one
        if (typeof rendererRef.current.cleanup === "function") {
          rendererRef.current.cleanup();
        }
        rendererRef.current = null;
      }

      // Clean up surface
      if (surfaceRef.current) {
        surfaceRef.current.delete();
        surfaceRef.current = null;
      }
    };
  }, [CanvasKit, children, width, height]);

  return (
    <canvas
      height={height}
      ref={canvasRef}
      style={{
        border: "1px solid #ccc",
        width: `${width}px`,
        height: `${height}px`,
        ...style,
      }}
      width={width}
    />
  );
};
