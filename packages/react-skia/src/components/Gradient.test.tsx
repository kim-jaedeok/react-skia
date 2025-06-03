import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Canvas } from "./Canvas";
import { LinearGradient, RadialGradient } from "./Gradient";
import { Rect } from "./Rect";

describe("Gradient Components", () => {
  describe("LinearGradient", () => {
    it("should render linear gradient with basic props", () => {
      const { container } = render(
        <Canvas width={300} height={200}>
          <Rect x={0} y={0} width={300} height={200} color="#FFFFFF">
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 100, y: 100 }}
              colors={["#FF0000", "#0000FF"]}
            />
          </Rect>
        </Canvas>,
      );

      const canvas = container.querySelector("canvas");
      expect(canvas).toBeInTheDocument();
    });

    it("should handle different gradient modes", () => {
      const modeOptions = ["clamp", "repeat", "mirror", "decal"] as const;

      modeOptions.forEach(mode => {
        expect(() => {
          render(
            <Canvas width={300} height={200}>
              <Rect x={0} y={0} width={300} height={200} color="#FFFFFF">
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 100, y: 100 }}
                  colors={["#FF0000", "#0000FF"]}
                  mode={mode}
                />
              </Rect>
            </Canvas>,
          );
        }).not.toThrow();
      });
    });

    it("should render with multiple colors and positions", () => {
      const { container } = render(
        <Canvas width={300} height={200}>
          <Rect x={0} y={0} width={300} height={200} color="#FFFFFF">
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 300, y: 0 }}
              colors={["#FF0000", "#00FF00", "#0000FF"]}
              positions={[0, 0.5, 1]}
            />
          </Rect>
        </Canvas>,
      );

      const canvas = container.querySelector("canvas");
      expect(canvas).toBeInTheDocument();
    });
  });

  describe("RadialGradient", () => {
    it("should render radial gradient with basic props", () => {
      const { container } = render(
        <Canvas width={300} height={200}>
          <Rect x={0} y={0} width={300} height={200} color="#FFFFFF">
            <RadialGradient
              center={{ x: 150, y: 100 }}
              radius={50}
              colors={["#FF0000", "#0000FF"]}
            />
          </Rect>
        </Canvas>,
      );

      const canvas = container.querySelector("canvas");
      expect(canvas).toBeInTheDocument();
    });

    it("should handle different gradient modes", () => {
      const modeOptions = ["clamp", "repeat", "mirror", "decal"] as const;

      modeOptions.forEach(mode => {
        expect(() => {
          render(
            <Canvas width={300} height={200}>
              <Rect x={0} y={0} width={300} height={200} color="#FFFFFF">
                <RadialGradient
                  center={{ x: 150, y: 100 }}
                  radius={50}
                  colors={["#FF0000", "#0000FF"]}
                  mode={mode}
                />
              </Rect>
            </Canvas>,
          );
        }).not.toThrow();
      });
    });

    it("should render with multiple colors and positions", () => {
      const { container } = render(
        <Canvas width={300} height={200}>
          <Rect x={0} y={0} width={300} height={200} color="#FFFFFF">
            <RadialGradient
              center={{ x: 150, y: 100 }}
              radius={80}
              colors={["#FF0000", "#FFFF00", "#00FF00", "#0000FF"]}
              positions={[0, 0.33, 0.66, 1]}
            />
          </Rect>
        </Canvas>,
      );

      const canvas = container.querySelector("canvas");
      expect(canvas).toBeInTheDocument();
    });
  });
});
