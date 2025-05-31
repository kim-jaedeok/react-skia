import { createElement } from "react";

import type { GroupProps } from "../types";

export function Group({ children, transform, opacity }: GroupProps) {
  return createElement("skia-group", { transform, opacity }, children);
}
