import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Canvas } from "./Canvas";
import { Circle } from "./Circle";

describe("Circle Component", () => {
  it("should render circle with basic props", () => {
    const { container } = render(
      <Canvas width={300} height={200}>
        <Circle cx={50} cy={50} r={25} color="#FF0000" />
      </Canvas>,
    );

    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });

  it("should handle different circle properties", () => {
    const testCases = [
      { cx: 100, cy: 75, r: 30, color: "#00FF00" },
      { cx: 0, cy: 0, r: 0, color: "#000000" },
      { cx: 500, cy: 500, r: 400, color: "#FF0000" },
    ];

    testCases.forEach(props => {
      expect(() => {
        render(
          <Canvas width={1000} height={1000}>
            <Circle {...props} />
          </Canvas>,
        );
      }).not.toThrow();
    });
  });

  it("should render with optional style properties", () => {
    expect(() => {
      render(
        <Canvas width={300} height={200}>
          <Circle
            cx={50}
            cy={50}
            r={25}
            color="#FF0000"
            style="stroke"
            strokeWidth={3}
          />
        </Canvas>,
      );
    }).not.toThrow();
  });
});
