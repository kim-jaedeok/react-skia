import { RenderHookResult, act, renderHook } from "@testing-library/react";
import { CanvasKit } from "canvaskit-wasm";
import { Mock, describe, expect, it, vi } from "vitest";

import { useSkia } from "./useSkia";

describe("useSkia", () => {
  it("should load CanvasKit when called", () => {
    let skia:
      | RenderHookResult<
          {
            CanvasKit: CanvasKit | null;
          },
          unknown
        >
      | undefined;

    act(() => {
      skia = renderHook(() => useSkia());
    });

    expect(skia?.result.current).not.toBeNull();
  });

  it("should handle options configuration", () => {
    const customPath = vi.fn((file: string) => `/custom/${file}`);
    const options = {
      canvasKitPath: customPath,
    };

    act(() => {
      renderHook(() => useSkia(options));
    });

    expect(customPath).toHaveReturnedWith("/custom/canvaskit.wasm");
  });

  it("should update config when options change", () => {
    const initialPath = vi.fn((file: string) => `/initial/${file}`);
    const initialOptions = {
      canvasKitPath: initialPath,
    };

    let skia:
      | RenderHookResult<
          {
            CanvasKit: CanvasKit | null;
          },
          {
            canvasKitPath: Mock<(file: string) => string>;
          }
        >
      | undefined;

    act(() => {
      skia = renderHook(options => useSkia(options), {
        initialProps: initialOptions,
      });
    });

    expect(initialPath).toHaveReturnedWith("/initial/canvaskit.wasm");

    // Update options
    const newPath = vi.fn((file: string) => `/updated/${file}`);
    const newOptions = {
      canvasKitPath: newPath,
    };

    act(() => {
      skia?.rerender(newOptions);
    });

    expect(newPath).toHaveReturnedWith("/updated/canvaskit.wasm");
  });

  it("should not update config when options not change", () => {
    const initialPath = vi.fn((file: string) => `/initial/${file}`);
    const initialOptions = {
      canvasKitPath: initialPath,
    };

    let skia:
      | RenderHookResult<
          {
            CanvasKit: CanvasKit | null;
          },
          {
            canvasKitPath: Mock<(file: string) => string>;
          }
        >
      | undefined;

    act(() => {
      skia = renderHook(options => useSkia(options), {
        initialProps: initialOptions,
      });
    });

    expect(initialPath).toHaveBeenCalledTimes(1);

    act(() => {
      skia?.rerender(initialOptions);
    });

    expect(initialPath).toHaveBeenCalledTimes(1);
  });
});
