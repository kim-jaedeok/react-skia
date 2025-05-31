import React from "react";

import type { TextProps } from "../types";

export function Text({
  x,
  y,
  text,
  fontSize = 16,
  color = "#000000",
  fontFamily = "Arial",
  children,
}: TextProps & { children?: React.ReactNode }) {
  return React.createElement(
    "skia-text",
    {
      x,
      y,
      text,
      fontSize,
      color,
      fontFamily,
    },
    children,
  );
}
