import { type ReactNode, createElement } from "react";

import type { TextProps } from "../types";

export const Text = ({
  x,
  y,
  text,
  fontSize = 16,
  color = "#000000",
  fontFamily = "Arial",
  children,
}: TextProps & { children?: ReactNode }) =>
  createElement(
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
