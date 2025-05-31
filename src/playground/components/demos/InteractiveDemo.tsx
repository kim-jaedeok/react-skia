import React from "react";

import { Circle, Group, Rect, SkiaCanvas, Text } from "../../../react-skia";

export function InteractiveDemo() {
  return (
    <div>
      <h3>🎮 상호작용</h3>
      <SkiaCanvas width={350} height={200} style={{ cursor: "pointer" }}>
        <Group>
          <Rect x={50} y={50} width={100} height={60} color="#3498DB" />
          <Text x={70} y={85} text="Click Me!" fontSize={16} color="#FFF" />
        </Group>

        <Group>
          <Circle cx={250} cy={80} r={30} color="#E74C3C" />
          <Text x={230} y={85} text="Touch" fontSize={12} color="#FFF" />
        </Group>

        <Text
          x={10}
          y={150}
          text="터치/클릭 이벤트 (구현 예정)"
          fontSize={12}
          color="#666"
        />
        <Text
          x={10}
          y={170}
          text="마우스/터치 좌표 감지"
          fontSize={11}
          color="#999"
        />
      </SkiaCanvas>
    </div>
  );
}
