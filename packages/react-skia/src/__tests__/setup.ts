import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, vi } from "vitest";

import { UseSkia } from "../hooks/useSkia";
import { createMockCanvasKit } from "./mocks/canvaskit-wasm";

// Global console.error spy for catching rendering errors

afterEach(() => {
  // Clear all mocks to reset state between tests
  vi.clearAllMocks();
  // Cleanup DOM after each test
  cleanup();
});

// Mock Canvas API for testing
beforeAll(() => {
  // HTMLCanvasElement.prototype.getContext mock
  HTMLCanvasElement.prototype.getContext = vi
    .fn()
    .mockImplementation(contextType => {
      if (contextType === "2d") {
        return {
          fillRect: vi.fn(),
          clearRect: vi.fn(),
          strokeRect: vi.fn(),
          fillText: vi.fn(),
          strokeText: vi.fn(),
          drawImage: vi.fn(),
          arc: vi.fn(),
          beginPath: vi.fn(),
          closePath: vi.fn(),
          fill: vi.fn(),
          stroke: vi.fn(),
          moveTo: vi.fn(),
          lineTo: vi.fn(),
          bezierCurveTo: vi.fn(),
          quadraticCurveTo: vi.fn(),
          save: vi.fn(),
          restore: vi.fn(),
          translate: vi.fn(),
          rotate: vi.fn(),
          scale: vi.fn(),
          createLinearGradient: vi.fn(() => ({
            addColorStop: vi.fn(),
          })),
          createRadialGradient: vi.fn(() => ({
            addColorStop: vi.fn(),
          })),
          setTransform: vi.fn(),
          resetTransform: vi.fn(),
          filter: "",
          globalAlpha: 1,
          globalCompositeOperation: "source-over",
          fillStyle: "#000000",
          strokeStyle: "#000000",
          lineWidth: 1,
          lineCap: "butt",
          lineJoin: "miter",
          miterLimit: 10,
          lineDashOffset: 0,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowBlur: 0,
          shadowColor: "rgba(0, 0, 0, 0)",
          font: "10px sans-serif",
          textAlign: "start",
          textBaseline: "alphabetic",
          direction: "inherit",
          canvas: null,
          measureText: vi.fn(() => ({ width: 0 })),
          getImageData: vi.fn(() => ({
            data: new Uint8ClampedArray(4),
            width: 1,
            height: 1,
          })),
          putImageData: vi.fn(),
          createImageData: vi.fn(),
          isPointInPath: vi.fn(() => false),
          isPointInStroke: vi.fn(() => false),
          rect: vi.fn(),
          clip: vi.fn(),
          setLineDash: vi.fn(),
          getLineDash: vi.fn(() => []),
        };
      }
      return null;
    });

  // HTMLCanvasElement size properties
  Object.defineProperty(HTMLCanvasElement.prototype, "width", {
    get() {
      return 300;
    },
    set() {},
  });

  Object.defineProperty(HTMLCanvasElement.prototype, "height", {
    get() {
      return 150;
    },
    set() {},
  });
});

// Mock useSkia hook
vi.mock("../hooks/useSkia", () => ({
  useSkia: vi.fn(() => {
    const skia: ReturnType<UseSkia> = {
      CanvasKit: createMockCanvasKit(),
    };

    return skia;
  }),
}));
