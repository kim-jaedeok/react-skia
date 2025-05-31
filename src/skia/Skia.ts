import type { CanvasKit } from "canvaskit-wasm";

// Declare global CanvasKit
declare global {
  interface Window {
    CanvasKitInit: any;
  }
}

class SkiaInstance {
  private static instance: SkiaInstance;
  private canvasKit: CanvasKit | null = null;
  private initPromise: Promise<CanvasKit> | null = null;

  private constructor() {}

  public static getInstance(): SkiaInstance {
    if (!SkiaInstance.instance) {
      SkiaInstance.instance = new SkiaInstance();
    }
    return SkiaInstance.instance;
  }

  public async init() {
    if (this.canvasKit) {
      return this.canvasKit;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      try {
        // Load CanvasKit from CDN
        const CanvasKitInit = (await import("canvaskit-wasm")).default;

        const canvasKit = await CanvasKitInit({
          locateFile: (file: string) =>
            `https://unpkg.com/canvaskit-wasm@0.40.0/bin/${file}`,
        });

        this.canvasKit = canvasKit;
        return canvasKit;
      } catch (error) {
        console.error("❌ Failed to initialize CanvasKit:", error);
        this.initPromise = null;
        throw error;
      }
    })();

    return this.initPromise;
  }

  public getCanvasKit(): CanvasKit | null {
    return this.canvasKit;
  }

  // Utility methods for creating Skia objects
  public createPath(): any {
    if (!this.canvasKit) throw new Error("CanvasKit not initialized");
    return new this.canvasKit.Path();
  }

  public createPaint(): any {
    if (!this.canvasKit) throw new Error("CanvasKit not initialized");
    return new this.canvasKit.Paint();
  }

  public createFont(fontData?: ArrayBuffer, size?: number): any {
    if (!this.canvasKit) throw new Error("CanvasKit not initialized");
    if (fontData) {
      const typeface =
        this.canvasKit.Typeface.MakeFreeTypeFaceFromData(fontData);
      return new this.canvasKit.Font(typeface, size || 16);
    }
    return new this.canvasKit.Font(null, size || 16);
  }

  public parseColorString(color: string): Float32Array {
    if (!this.canvasKit) throw new Error("CanvasKit not initialized");
    return this.canvasKit.parseColorString(color);
  }

  public Color(r: number, g: number, b: number, a: number = 1): Float32Array {
    if (!this.canvasKit) throw new Error("CanvasKit not initialized");
    return this.canvasKit.Color(r, g, b, a);
  }

  public Matrix(): any {
    if (!this.canvasKit) throw new Error("CanvasKit not initialized");
    return this.canvasKit.Matrix;
  }
}

export const Skia = SkiaInstance.getInstance();
