import React from "react";

import type { CircleProps } from "../types";

export function Circle({
  cx,
  cy,
  r,
  color = "#000000",
  strokeWidth = 1,
  style = "fill",
  children,
}: CircleProps & { children?: React.ReactNode }) {
  return React.createElement(
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
