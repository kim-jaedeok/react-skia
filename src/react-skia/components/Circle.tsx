import { type ReactNode, createElement } from "react";

import type { CircleProps } from "../types";

export function Circle({
  cx,
  cy,
  r,
  color = "#000000",
  strokeWidth = 1,
  style = "fill",
  children,
}: CircleProps & { children?: ReactNode }) {
  return createElement(
    "skia-circle",
    {
      cx,
      cy,
      r,
      color,
      strokeWidth,
      style,
    },
    children,
  );
}
