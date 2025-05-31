import { useEffect } from "react";

import {
  Easing as ReanimatedEasing,
  useSharedValue as useReanimatedSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "../../../react-reanimated";
import { Circle, Group, SkiaCanvas, Text } from "../../../react-skia";

// 애니메이션 데모 컴포넌트
function AnimatedCircle({
  translateX,
  scale,
}: {
  translateX: number;
  scale: number;
}) {
  return (
    <Group transform={[scale, 0, 0, scale, translateX, 0]}>
      <Circle cx={50} cy={50} r={25} color="#FF6B6B" />
    </Group>
  );
}

// 애니메이션 로직을 관리하는 컨테이너 컴포넌트
export function AnimationDemo() {
  const translateX = useReanimatedSharedValue(0);
  const scale = useReanimatedSharedValue(1);

  useEffect(() => {
    // withRepeat를 사용한 무한 반복 애니메이션
    translateX.value = withRepeat(
      withSequence(
        withTiming(200, {
          duration: 2000,
          easing: ReanimatedEasing.inOut(ReanimatedEasing.quad),
        }),
        withTiming(0, {
          duration: 2000,
          easing: ReanimatedEasing.inOut(ReanimatedEasing.quad),
        }),
      ),
      -1, // 무한 반복
      false, // reverse하지 않음 (시퀀스가 이미 왕복을 처리)
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 1000, easing: ReanimatedEasing.bounce }),
        withTiming(1, { duration: 1000, easing: ReanimatedEasing.bounce }),
      ),
      -1, // 무한 반복
      false,
    );
  }, [translateX, scale]);

  return (
    <div>
      <h3>⚡ 애니메이션</h3>
      <SkiaCanvas width={350} height={200}>
        <AnimatedCircle translateX={translateX.value} scale={scale.value} />
        <Circle
          cx={50}
          cy={50}
          r={25}
          color="#E8E8E8"
          style="stroke"
          strokeWidth={2}
        />
        <Text
          x={10}
          y={120}
          text="이동 + 크기 애니메이션"
          fontSize={14}
          color="#666"
        />
        <Text
          x={10}
          y={140}
          text="React Native Skia 스타일"
          fontSize={12}
          color="#999"
        />
      </SkiaCanvas>
    </div>
  );
}
