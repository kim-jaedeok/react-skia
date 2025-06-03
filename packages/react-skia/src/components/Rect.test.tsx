import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Canvas } from "../components/Canvas";
import { Rect } from "../components/Rect";

describe("Rect Component", () => {
  it("should render rect with basic props", () => {
    const { container } = render(
      <Canvas width={300} height={200}>
        <Rect x={10} y={10} width={50} height={30} color="#FF0000" />
      </Canvas>,
    );

    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });

  it("should handle different rect properties", () => {
    const testCases = [
      { x: 20, y: 30, width: 100, height: 80, color: "#00FF00" },
      { x: 10, y: 10, width: 0, height: 0, color: "#FF0000" },
      { x: -10, y: -5, width: 50, height: 30, color: "#FF0000" },
      { x: 0, y: 0, width: 800, height: 600, color: "#FF0000" },
    ];

    testCases.forEach(props => {
      expect(() => {
        render(
          <Canvas width={1000} height={1000}>
            <Rect {...props} />
          </Canvas>,
        );
      }).not.toThrow();
    });
  });

  it("should render with optional style properties", () => {
    expect(() => {
      render(
        <Canvas width={300} height={200}>
          <Rect
            x={10}
            y={10}
            width={50}
            height={30}
            color="#FF0000"
            style="stroke"
            strokeWidth={2}
          />
        </Canvas>,
      );
    }).not.toThrow();
  });
});
