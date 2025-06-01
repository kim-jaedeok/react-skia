import { createElement } from "react";

import type { GroupProps } from "../types";

export const Group = ({ children, transform, opacity }: GroupProps) =>
  createElement("skia-group", { transform, opacity }, children);
