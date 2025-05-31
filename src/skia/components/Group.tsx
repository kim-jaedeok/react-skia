import React from "react";

import type { GroupProps } from "../types";

export function Group({ children, transform, opacity }: GroupProps) {
  return React.createElement("skia-group", { transform, opacity }, children);
}
