import { createElement } from "react";

interface ImageProps {
  x: number;
  y: number;
  width: number;
  height: number;
  src: string;
  fit?: "fill" | "contain" | "cover" | "none";
  opacity?: number;
}

export const Image = ({
  x,
  y,
  width,
  height,
  src,
  fit = "fill",
  opacity = 1,
}: ImageProps) =>
  createElement("skia-image", {
    x,
    y,
    width,
    height,
    src,
    fit,
    opacity,
  });
