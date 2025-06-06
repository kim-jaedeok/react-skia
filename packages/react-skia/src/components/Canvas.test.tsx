import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Canvas } from "./Canvas";
import { Circle } from "./Circle";
import { Rect } from "./Rect";

describe("Canvas Component", () => {
  it("should render canvas element with dimensions", () => {
    render(<Canvas width={500} height={400} />);

    const canvas = document.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
    expect(canvas?.tagName).toBe("CANVAS");
    expect(canvas).toHaveAttribute("width", "500");
    expect(canvas).toHaveAttribute("height", "400");
  });

  it("should render with default dimensions when not specified", () => {
    render(<Canvas />);

    const canvas = document.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });

  it("should render children components", () => {
    render(
      <Canvas width={300} height={200}>
        <Rect x={10} y={10} width={50} height={30} color="#FF0000" />
        <Circle cx={100} cy={100} r={25} color="#00FF00" />
      </Canvas>,
    );

    const canvas = document.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    render(<Canvas width={300} height={200} className="custom-canvas" />);

    const canvas = document.querySelector("canvas");
    expect(canvas).toHaveClass("custom-canvas");
  });

  it("should handle CanvasKit configuration options", () => {
    const canvasKitPath = vi.fn((file: string) => `/path/to/canvaskit/${file}`);
    const customOptions = {
      canvasKitPath,
    };

    render(
      <Canvas width={300} height={200} options={customOptions}>
        <Rect x={10} y={10} width={50} height={30} color="#FF0000" />
      </Canvas>,
    );

    const canvas = document.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
    expect(canvasKitPath).toHaveBeenCalled();
    expect(canvasKitPath).toHaveReturnedWith(
      expect.stringContaining("/path/to/canvaskit/canvaskit.wasm"),
    );
  });
});
