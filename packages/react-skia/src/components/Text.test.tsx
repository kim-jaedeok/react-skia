import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Canvas } from "../components/Canvas";
import { Text } from "../components/Text";

describe("Text Component", () => {
  it("should render text with basic props without errors", () => {
    const { container } = render(
      <Canvas width={300} height={200}>
        <Text x={10} y={20} text="Hello World" color="#000000" />
      </Canvas>,
    );

    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });

  it("should handle different text properties without errors", () => {
    const testCases = [
      { x: 50, y: 60, text: "Test Text", color: "#FF0000" },
      { x: 10, y: 20, text: "", color: "#000000" },
      { x: -10, y: -5, text: "Negative coords", color: "#000000" },
      { x: 10, y: 20, text: "Hello 🌍 World! @#$%^&*()", color: "#000000" },
      {
        x: 10,
        y: 20,
        text: "This is a very long text that might exceed the canvas boundaries",
        color: "#000000",
      },
    ];

    testCases.forEach(props => {
      const { unmount } = render(
        <Canvas width={300} height={200}>
          <Text {...props} />
        </Canvas>,
      );

      // Clean up after each render
      unmount();
    });
  });

  it("should render with optional font properties without errors", () => {
    expect(() => {
      render(
        <Canvas width={300} height={200}>
          <Text
            x={10}
            y={20}
            text="Styled Text"
            color="#000000"
            fontSize={18}
            fontFamily="Arial"
          />
        </Canvas>,
      );
    }).not.toThrow();
  });
});
