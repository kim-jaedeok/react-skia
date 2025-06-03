import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Canvas } from "./Canvas";
import { Path } from "./Path";

describe("Path Component", () => {
  it("should render path with basic props", () => {
    const { container } = render(
      <Canvas width={300} height={200}>
        <Path path="M 10 10 L 100 100" color="#FF0000" />
      </Canvas>,
    );

    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });

  it("should handle different path strings", () => {
    const testCases = [
      { path: "M 20 20 L 120 120 L 20 120 Z", color: "#00FF00" },
      { path: "M 10 10 L 100 100 L 50 150 Z", color: "#0000FF" },
      { path: "M 50 50 Q 100 10 150 50", color: "#FF00FF" },
      { path: "M 20 20 C 20 100 200 100 200 20", color: "#FFFF00" },
      { path: "M 10 80 Q 52.5 10, 95 80 T 180 80", color: "#00FFFF" },
      { path: "", color: "#FF0000" },
      { path: "invalid path data", color: "#FF0000" },
    ];

    testCases.forEach(props => {
      expect(() => {
        render(
          <Canvas width={300} height={200}>
            <Path {...props} />
          </Canvas>,
        );
      }).not.toThrow();
    });
  });

  it("should render with style and stroke properties", () => {
    const styleOptions = [
      { style: "fill" as const },
      { style: "stroke" as const, strokeWidth: 1 },
      { style: "stroke" as const, strokeWidth: 5 },
    ];

    styleOptions.forEach(styleProps => {
      expect(() => {
        render(
          <Canvas width={300} height={200}>
            <Path path="M 10 10 L 100 100" color="#FF0000" {...styleProps} />
          </Canvas>,
        );
      }).not.toThrow();
    });
  });
});
