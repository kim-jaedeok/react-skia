import { type ReactNode, createElement } from "react";

import type { RectProps } from "../types";

export const Rect = ({
  x,
  y,
  width,
  height,
  color = "#000000",
  strokeWidth = 1,
  style = "fill",
  children,
}: RectProps & { children?: ReactNode }) =>
  createElement(
    "skia-rect",
    {
      x,
      y,
      width,
      height,
      color,
      strokeWidth,
      style,
    },
    children,
  );
