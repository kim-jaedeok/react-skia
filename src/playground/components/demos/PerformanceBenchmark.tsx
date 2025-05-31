import { useEffect, useMemo } from "react";

import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "../../../react-reanimated";
import { Circle, Group, Rect, SkiaCanvas, Text } from "../../../react-skia";

// Performance benchmark with many animated elements
function ManyAnimatedCircles() {
  const numCircles = 50;

  // Create shared values at the top level
  const rotationValues = Array.from({ length: numCircles }, () =>
    useSharedValue(0),
  );
  const scaleValues = Array.from({ length: numCircles }, () =>
    useSharedValue(1),
  );

  const circles = useMemo(
    () =>
      Array.from({ length: numCircles }, (_, i) => ({
        id: i,
        rotation: rotationValues[i],
        scale: scaleValues[i],
        x: 50 + (i % 10) * 25,
        y: 50 + Math.floor(i / 10) * 25,
        color: `hsl(${(i * 360) / numCircles}, 70%, 60%)`,
      })),
    [rotationValues, scaleValues],
  );

  useEffect(() => {
    circles.forEach((circle, i) => {
      // Staggered rotation animation
      circle.rotation.value = withRepeat(
        withTiming(360, {
          duration: 2000 + i * 50,
          easing: Easing.linear,
        }),
        -1,
        false,
      );

      // Staggered scale animation
      circle.scale.value = withRepeat(
        withSequence(
          withTiming(1.5, {
            duration: 1000 + i * 20,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(1, {
            duration: 1000 + i * 20,
            easing: Easing.inOut(Easing.quad),
          }),
        ),
        -1,
        false,
      );
    });
  }, [circles]);

  return (
    <SkiaCanvas width={350} height={200}>
      {circles.map(circle => (
        <Group
          key={circle.id}
          transform={[
            circle.scale.value,
            0,
            0,
            circle.scale.value,
            circle.x,
            circle.y,
          ]}
        >
          <Group
            transform={[
              Math.cos((circle.rotation.value * Math.PI) / 180),
              -Math.sin((circle.rotation.value * Math.PI) / 180),
              Math.sin((circle.rotation.value * Math.PI) / 180),
              Math.cos((circle.rotation.value * Math.PI) / 180),
              0,
              0,
            ]}
          >
            <Circle cx={0} cy={0} r={8} color={circle.color} />
          </Group>
        </Group>
      ))}

      <Text
        x={10}
        y={20}
        text={`${numCircles}개 동시 애니메이션`}
        fontSize={14}
        color="#333"
      />
      <Text
        x={10}
        y={180}
        text="성능 벤치마크 테스트"
        fontSize={12}
        color="#666"
      />
    </SkiaCanvas>
  );
}

// Fluid motion simulation
function FluidMotion() {
  const time = useSharedValue(0);

  useEffect(() => {
    time.value = withRepeat(
      withTiming(Math.PI * 4, { duration: 5000, easing: Easing.linear }),
      -1,
      false,
    );
  }, []);

  // Create derived values at the top level
  const xValues = Array.from({ length: 20 }, (_, i) => {
    const baseX = 20 + i * 15;
    return useDerivedValue<number>(() => {
      return baseX + Math.sin(time.value + i * 0.3) * 10;
    }, [time]);
  });

  const yValues = Array.from({ length: 20 }, (_, i) => {
    const baseY = 100;
    return useDerivedValue<number>(() => {
      return baseY + Math.cos(time.value + i * 0.5) * 30;
    }, [time]);
  });

  const scaleValues = Array.from({ length: 20 }, (_, i) => {
    return useDerivedValue<number>(() => {
      return 1 + Math.sin(time.value + i * 0.7) * 0.3;
    }, [time]);
  });

  // Create wave-like motion for multiple elements
  const elements = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => {
        return {
          id: i,
          x: xValues[i],
          y: yValues[i],
          scale: scaleValues[i],
          color: `hsl(${200 + i * 8}, 70%, 60%)`,
        };
      }),
    [xValues, yValues, scaleValues],
  );

  return (
    <SkiaCanvas width={350} height={200}>
      {elements.map(element => (
        <Group
          key={element.id}
          transform={[
            element.scale.value,
            0,
            0,
            element.scale.value,
            element.x.value,
            element.y.value,
          ]}
        >
          <Circle cx={0} cy={0} r={6} color={element.color} />
        </Group>
      ))}

      <Text
        x={10}
        y={20}
        text="유체 모션 시뮬레이션"
        fontSize={14}
        color="#333"
      />
      <Text
        x={10}
        y={180}
        text="복잡한 수학 함수 기반"
        fontSize={12}
        color="#666"
      />
    </SkiaCanvas>
  );
}

// Complex transformation chains
function ComplexTransforms() {
  const rotation1 = useSharedValue(0);
  const rotation2 = useSharedValue(0);
  const rotation3 = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Multiple nested rotations at different speeds
    rotation1.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false,
    );

    rotation2.value = withRepeat(
      withTiming(-720, { duration: 3000, easing: Easing.linear }),
      -1,
      false,
    );

    rotation3.value = withRepeat(
      withTiming(1080, { duration: 3000, easing: Easing.linear }),
      -1,
      false,
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, []);

  return (
    <SkiaCanvas width={350} height={200}>
      {/* Nested transformation groups */}
      <Group transform={[1, 0, 0, 1, 175, 100]}>
        <Group
          transform={[
            Math.cos((rotation1.value * Math.PI) / 180),
            -Math.sin((rotation1.value * Math.PI) / 180),
            Math.sin((rotation1.value * Math.PI) / 180),
            Math.cos((rotation1.value * Math.PI) / 180),
            0,
            0,
          ]}
        >
          <Group transform={[scale.value, 0, 0, scale.value, 0, 0]}>
            <Group
              transform={[
                Math.cos((rotation2.value * Math.PI) / 180),
                -Math.sin((rotation2.value * Math.PI) / 180),
                Math.sin((rotation2.value * Math.PI) / 180),
                Math.cos((rotation2.value * Math.PI) / 180),
                0,
                0,
              ]}
            >
              <Rect x={-30} y={-5} width={60} height={10} color="#E74C3C" />

              <Group
                transform={[
                  Math.cos((rotation3.value * Math.PI) / 180),
                  -Math.sin((rotation3.value * Math.PI) / 180),
                  Math.sin((rotation3.value * Math.PI) / 180),
                  Math.cos((rotation3.value * Math.PI) / 180),
                  25,
                  0,
                ]}
              >
                <Circle cx={0} cy={0} r={8} color="#3498DB" />
              </Group>
            </Group>
          </Group>
        </Group>
      </Group>

      <Text x={10} y={20} text="복합 변환 체인" fontSize={14} color="#333" />
      <Text
        x={10}
        y={180}
        text="중첩된 회전 + 크기 변화"
        fontSize={12}
        color="#666"
      />
    </SkiaCanvas>
  );
}

export function PerformanceBenchmark() {
  return (
    <div>
      <h2>⚡ 성능 벤치마크</h2>
      <p>React Native Reanimated 웹 포트의 성능 테스트</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div>
          <h3>🎯 다중 요소 애니메이션</h3>
          <ManyAnimatedCircles />
        </div>

        <div>
          <h3>🌊 유체 모션</h3>
          <FluidMotion />
        </div>

        <div>
          <h3>🔄 복합 변환</h3>
          <ComplexTransforms />
        </div>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <h4>성능 특징:</h4>
        <ul style={{ margin: 0, paddingLeft: "20px" }}>
          <li>60FPS 유지: requestAnimationFrame 기반 최적화</li>
          <li>메모리 효율성: 자동 리스너 정리</li>
          <li>GPU 가속: CanvasKit 하드웨어 렌더링</li>
          <li>타입 안전성: 완전한 TypeScript 지원</li>
        </ul>
      </div>
    </div>
  );
}
