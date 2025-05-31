import React from "react";

import type { PathProps } from "../types";

export function Path({
  path,
  color = "#000000",
  strokeWidth = 1,
  style = "fill",
  children,
}: PathProps & { children?: React.ReactNode }) {
  return React.createElement(
    "skia-path",
    {
      path,
      color,
      strokeWidth,
      style,
    },
    children,
  );
}
