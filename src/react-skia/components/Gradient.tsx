import { createElement } from "react";

export interface LinearGradientProps {
  start: { x: number; y: number };
  end: { x: number; y: number };
  colors: string[];
  positions?: number[]; // Optional array of positions (0.0 to 1.0) for each color
  mode?: "clamp" | "repeat" | "mirror" | "decal"; // Optional tile mode
}

export interface RadialGradientProps {
  center: { x: number; y: number };
  radius: number;
  colors: string[];
  positions?: number[]; // Optional array of positions (0.0 to 1.0) for each color
  mode?: "clamp" | "repeat" | "mirror" | "decal"; // Optional tile mode
}

export const LinearGradient = ({
  start,
  end,
  colors,
  positions,
  mode = "clamp",
}: LinearGradientProps) =>
  createElement("skia-linear-gradient", {
    start,
    end,
    colors,
    positions,
    mode,
  });

export const RadialGradient = ({
  center,
  radius,
  colors,
  positions,
  mode = "clamp",
}: RadialGradientProps) =>
  createElement("skia-radial-gradient", {
    center,
    radius,
    colors,
    positions,
    mode,
  });
