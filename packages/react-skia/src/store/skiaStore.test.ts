import CanvasKitInit from "canvaskit-wasm";
import { createStore } from "jotai";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createMockCanvasKit } from "../__tests__/mocks/canvaskit-wasm";
import {
  canvasKitAtom,
  canvasKitConfigAtom,
  loadCanvasKitAtom,
} from "./skiaStore";

// Mock CanvasKit initialization
vi.mock("canvaskit-wasm", () => ({
  default: vi.fn(),
}));

const mockCanvasKit = createMockCanvasKit();
const mockCanvasKitInit = vi.mocked(CanvasKitInit);

describe("skiaStore", () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("loadCanvasKitAtom", () => {
    it("should load CanvasKit with default path", async () => {
      mockCanvasKitInit.mockResolvedValue(mockCanvasKit);

      const result = await store.set(loadCanvasKitAtom);
      const canvasKit = store.get(canvasKitAtom);

      expect(result).toBe(mockCanvasKit);
      expect(canvasKit).toBe(mockCanvasKit);
      expect(mockCanvasKitInit).toHaveBeenCalledWith({
        locateFile: expect.any(Function),
      });

      // Test the locateFile function with default path
      const call = mockCanvasKitInit.mock.calls[0];
      const locateFile = call[0]?.locateFile;
      const result2 = locateFile?.("canvaskit.wasm");

      expect(result2).toBe("/canvaskit.wasm");
    });

    it("should use custom canvasKitPath when provided", async () => {
      const customPath = "/custom/path/canvaskit.wasm";
      const customPathFn = vi.fn().mockReturnValue(customPath);

      store.set(canvasKitConfigAtom, { canvasKitPath: customPathFn });
      mockCanvasKitInit.mockResolvedValue(mockCanvasKit);

      const result = await store.set(loadCanvasKitAtom);

      expect(result).toBe(mockCanvasKit);
      expect(mockCanvasKitInit).toHaveBeenCalledWith({
        locateFile: expect.any(Function),
      });

      // Test the locateFile function
      const call = mockCanvasKitInit.mock.calls[0];
      const locateFile = call[0]?.locateFile;
      const locateFileResult = locateFile?.("canvaskit.wasm");

      expect(customPathFn).toHaveBeenCalledWith("canvaskit.wasm");
      expect(locateFileResult).toBe(customPath);
    });

    it("should handle initialization failure gracefully", async () => {
      const error = new Error("Failed to load CanvasKit");
      mockCanvasKitInit.mockRejectedValue(error);

      // Mock console.error to avoid noise in test output
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await expect(store.set(loadCanvasKitAtom)).rejects.toThrow(
        "Failed to load CanvasKit",
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to initialize CanvasKit:",
        error,
      );

      consoleSpy.mockRestore();
    });

    it("should not reload if CanvasKit is already loaded", async () => {
      store.set(canvasKitAtom, mockCanvasKit);

      const result = await store.set(loadCanvasKitAtom);

      expect(result).toBe(mockCanvasKit);
      expect(mockCanvasKitInit).not.toHaveBeenCalled();
    });

    it("should force reload when force option is true", async () => {
      store.set(canvasKitAtom, mockCanvasKit);
      mockCanvasKitInit.mockResolvedValue(mockCanvasKit);

      const result = await store.set(loadCanvasKitAtom, { force: true });

      expect(result).toBe(mockCanvasKit);
      expect(mockCanvasKitInit).toHaveBeenCalled();
    });
  });

  describe("canvasKitConfigAtom", () => {
    it("should have default empty configuration", () => {
      const config = store.get(canvasKitConfigAtom);
      expect(config).toEqual({});
    });

    it("should allow setting custom configuration", () => {
      const customConfig = {
        canvasKitPath: (file: string) => `/custom/${file}`,
      };

      store.set(canvasKitConfigAtom, customConfig);
      const config = store.get(canvasKitConfigAtom);

      expect(config).toBe(customConfig);
    });
  });
});
