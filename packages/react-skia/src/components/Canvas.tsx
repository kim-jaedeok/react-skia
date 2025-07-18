import { useEffect, useRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { Surface } from "canvaskit-wasm";

import { useSkia } from "../hooks/useSkia";
import { SkiaRenderer } from "../renderer/SkiaRenderer";

interface CanvasProps extends ComponentPropsWithoutRef<"canvas"> {
  options?: Partial<{
    canvasKitPath: (file: string) => string;
  }>;
}

export const Canvas = ({ options, children, ...rest }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { CanvasKit } = useSkia(options);
  const surfaceRef = useRef<Surface | null>(null);
  const rendererRef = useRef<SkiaRenderer | null>(null);

  // Initialize Surface and Renderer
  // Scale canvas for high-DPI displays
  useEffect(() => {
    if (!CanvasKit || !canvasRef.current) {
      return;
    }

    // Get device pixel ratio for high-DPI displays
    const canvasElement = canvasRef.current;
    const pixelRatio = window.devicePixelRatio || 1;
    const width = canvasElement.clientWidth;
    const height = canvasElement.clientHeight;

    // Set actual canvas size for high resolution
    canvasElement.width = width * pixelRatio;
    canvasElement.height = height * pixelRatio;

    // Scale canvas back to original size via CSS
    canvasElement.style.width = `${width}px`;
    canvasElement.style.height = `${height}px`;

    // Create surface using modern API with high-DPI support
    surfaceRef.current = CanvasKit.MakeSWCanvasSurface(canvasElement);
    // Create renderer instance
    rendererRef.current = new SkiaRenderer(CanvasKit);

    if (!surfaceRef.current) {
      console.error("Failed to create surface");
      return;
    }

    // Scale the drawing context for high-DPI
    surfaceRef.current.getCanvas().scale(pixelRatio, pixelRatio);

    return () => {
      // Clean up renderer first
      if (rendererRef.current) {
        rendererRef.current.cleanup();
        rendererRef.current = null;
      }

      // Clean up surface
      if (surfaceRef.current) {
        surfaceRef.current.delete();
        surfaceRef.current = null;
      }
    };
  }, [CanvasKit]);

  // Render the children using the renderer
  useEffect(() => {
    if (!CanvasKit || !surfaceRef.current || !rendererRef.current) {
      return;
    }

    rendererRef.current.render(children, {
      CanvasKit,
      getSurface: () => {
        if (!surfaceRef.current) {
          throw new Error("Surface is not initialized");
        }

        return surfaceRef.current;
      },
    });
  }, [CanvasKit, children]);

  return <canvas ref={canvasRef} {...rest} />;
};
