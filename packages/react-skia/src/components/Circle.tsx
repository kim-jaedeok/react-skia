import { type ReactNode, createElement } from "react";

import type { CircleProps } from "../types";

export const Circle = ({
  cx,
  cy,
  r,
  color = "#000000",
  strokeWidth = 1,
  style = "fill",
  children,
}: CircleProps & { children?: ReactNode }) =>
  createElement(
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
