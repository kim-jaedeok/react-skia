import { type ReactNode, createElement } from "react";

import type { PathProps } from "../types";

export const Path = ({
  path,
  color = "#000000",
  strokeWidth = 1,
  style = "fill",
  children,
}: PathProps & { children?: ReactNode }) =>
  createElement(
    "skia-path",
    {
      path,
      color,
      strokeWidth,
      style,
    },
    children,
  );
