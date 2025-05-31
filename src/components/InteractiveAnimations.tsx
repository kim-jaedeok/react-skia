import React from "react";

import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "../react-reanimated";
import { Circle, Group, Path, Rect, SkiaCanvas, Text } from "../react-skia";

// 인터랙티브 버튼 컴포넌트 (간단 버전)
function InteractiveButton() {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    // 자동 애니메이션
    const animate = () => {
      scale.value = withSequence(
        withTiming(1.2, { duration: 500, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) }),
      );

      rotation.value = withTiming(rotation.value + 360, {
        duration: 1000,
        easing: Easing.out(Easing.quad),
      });
    };

    animate();
    const interval = setInterval(animate, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SkiaCanvas width={350} height={200}>
      <Group transform={[scale.value, 0, 0, scale.value, 175, 100]}>
        <Group
          transform={[
            Math.cos((rotation.value * Math.PI) / 180),
            -Math.sin((rotation.value * Math.PI) / 180),
            Math.sin((rotation.value * Math.PI) / 180),
            Math.cos((rotation.value * Math.PI) / 180),
            0,
            0,
          ]}
        >
          <Rect x={-50} y={-20} width={100} height={40} color="#5F27CD" />
          <Text x={-20} y={5} text="자동" fontSize={16} color="white" />
        </Group>
      </Group>

      <Text
        x={10}
        y={20}
        text="자동 애니메이션 버튼"
        fontSize={14}
        color="#666"
      />
      <Text
        x={10}
        y={180}
        text="크기 + 회전 애니메이션"
        fontSize={12}
        color="#999"
      />
    </SkiaCanvas>
  );
}

// 복잡한 시계 애니메이션
function AnimatedClock() {
  const secondsAngle = useSharedValue(0);
  const minutesAngle = useSharedValue(0);
  const hoursAngle = useSharedValue(0);

  React.useEffect(() => {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours() % 12;

    // 초기 각도 설정
    secondsAngle.value = seconds * 6; // 360/60 = 6도씩
    minutesAngle.value = minutes * 6 + seconds * 0.1;
    hoursAngle.value = hours * 30 + minutes * 0.5; // 360/12 = 30도씩

    // 초침 애니메이션 (매초)
    const secondsInterval = setInterval(() => {
      secondsAngle.value = withTiming(secondsAngle.value + 6, {
        duration: 1000,
        easing: Easing.out(Easing.quad),
      });
    }, 1000);

    // 분침 애니메이션 (매분)
    const minutesInterval = setInterval(() => {
      minutesAngle.value = withTiming(minutesAngle.value + 6, {
        duration: 1000,
        easing: Easing.linear,
      });
    }, 60000);

    // 시침 애니메이션 (매시간)
    const hoursInterval = setInterval(() => {
      hoursAngle.value = withTiming(hoursAngle.value + 30, {
        duration: 1000,
        easing: Easing.linear,
      });
    }, 3600000);

    return () => {
      clearInterval(secondsInterval);
      clearInterval(minutesInterval);
      clearInterval(hoursInterval);
    };
  }, []);

  const centerX = 175;
  const centerY = 100;

  // 시계 바늘 끝점 계산
  const secondHandX = useDerivedValue(() => {
    const rad = ((secondsAngle.value - 90) * Math.PI) / 180;
    return centerX + Math.cos(rad) * 35;
  }, [secondsAngle]);

  const secondHandY = useDerivedValue(() => {
    const rad = ((secondsAngle.value - 90) * Math.PI) / 180;
    return centerY + Math.sin(rad) * 35;
  }, [secondsAngle]);

  const minuteHandX = useDerivedValue(() => {
    const rad = ((minutesAngle.value - 90) * Math.PI) / 180;
    return centerX + Math.cos(rad) * 30;
  }, [minutesAngle]);

  const minuteHandY = useDerivedValue(() => {
    const rad = ((minutesAngle.value - 90) * Math.PI) / 180;
    return centerY + Math.sin(rad) * 30;
  }, [minutesAngle]);

  const hourHandX = useDerivedValue(() => {
    const rad = ((hoursAngle.value - 90) * Math.PI) / 180;
    return centerX + Math.cos(rad) * 20;
  }, [hoursAngle]);

  const hourHandY = useDerivedValue(() => {
    const rad = ((hoursAngle.value - 90) * Math.PI) / 180;
    return centerY + Math.sin(rad) * 20;
  }, [hoursAngle]);

  return (
    <SkiaCanvas width={350} height={200}>
      {/* 시계판 */}
      <Circle cx={centerX} cy={centerY} r={45} color="#F8F9FA" />
      <Circle
        cx={centerX}
        cy={centerY}
        r={45}
        color="#495057"
        style="stroke"
        strokeWidth={2}
      />

      {/* 시간 표시 (12, 3, 6, 9) */}
      {[0, 1, 2, 3].map(i => {
        const angle = i * 90;
        const rad = ((angle - 90) * Math.PI) / 180;
        const x = centerX + Math.cos(rad) * 35;
        const y = centerY + Math.sin(rad) * 35;
        const hour = angle === 0 ? 12 : angle / 30;

        return (
          <Text
            key={i}
            x={x - 5}
            y={y + 3}
            text={hour.toString()}
            fontSize={12}
            color="#495057"
          />
        );
      })}

      {/* 시침 */}
      <Path
        path={`M ${centerX} ${centerY} L ${hourHandX.value} ${hourHandY.value}`}
        color="#212529"
        style="stroke"
        strokeWidth={4}
      />

      {/* 분침 */}
      <Path
        path={`M ${centerX} ${centerY} L ${minuteHandX.value} ${minuteHandY.value}`}
        color="#495057"
        style="stroke"
        strokeWidth={3}
      />

      {/* 초침 */}
      <Path
        path={`M ${centerX} ${centerY} L ${secondHandX.value} ${secondHandY.value}`}
        color="#E74C3C"
        style="stroke"
        strokeWidth={1}
      />

      {/* 중심점 */}
      <Circle cx={centerX} cy={centerY} r={3} color="#212529" />

      <Text x={10} y={20} text="애니메이션 시계" fontSize={14} color="#666" />
      <Text
        x={10}
        y={180}
        text="실시간 시계 바늘 애니메이션"
        fontSize={12}
        color="#999"
      />
    </SkiaCanvas>
  );
}

// 로딩 스피너 컬렉션
function LoadingSpinners() {
  const rotation1 = useSharedValue(0);
  const rotation2 = useSharedValue(0);
  const scale1 = useSharedValue(1);
  const scale2 = useSharedValue(1);

  React.useEffect(() => {
    // 회전 스피너 1
    rotation1.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
      false,
    );

    // 회전 스피너 2 (반대 방향)
    rotation2.value = withRepeat(
      withTiming(-360, { duration: 1500, easing: Easing.linear }),
      -1,
      false,
    );

    // 펄스 효과 1
    scale1.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 800, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );

    // 펄스 효과 2
    scale2.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 600, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 600, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, []);

  return (
    <SkiaCanvas width={350} height={200}>
      {/* 회전 스피너 1 */}
      <Group transform={[1, 0, 0, 1, 80, 60]}>
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
          <Path
            path="M 0 -15 A 15 15 0 0 1 15 0"
            color="#3498DB"
            style="stroke"
            strokeWidth={3}
          />
        </Group>
      </Group>

      {/* 회전 스피너 2 (동심원) */}
      <Group transform={[1, 0, 0, 1, 200, 60]}>
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
          <Circle cx={0} cy={-20} r={3} color="#E74C3C" />
          <Circle cx={0} cy={20} r={3} color="#E74C3C" />
          <Circle cx={-20} cy={0} r={3} color="#E74C3C" />
          <Circle cx={20} cy={0} r={3} color="#E74C3C" />
        </Group>
      </Group>

      {/* 펄스 스피너 1 */}
      <Group
        transform={[scale1.value, 0, 0, scale1.value, 80, 140]}
        opacity={0.7}
      >
        <Circle cx={0} cy={0} r={10} color="#9B59B6" />
      </Group>

      {/* 펄스 스피너 2 */}
      <Group transform={[scale2.value, 0, 0, scale2.value, 200, 140]}>
        <Rect x={-8} y={-8} width={16} height={16} color="#F39C12" />
      </Group>

      <Text
        x={10}
        y={20}
        text="로딩 스피너 컬렉션"
        fontSize={14}
        color="#666"
      />
      <Text
        x={10}
        y={180}
        text="다양한 로딩 애니메이션"
        fontSize={12}
        color="#999"
      />
    </SkiaCanvas>
  );
}

export function InteractiveAnimations() {
  return (
    <div>
      <h2>🎮 인터랙티브 애니메이션</h2>
      <p>사용자 상호작용과 실시간 애니메이션</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div>
          <h3>🔘 인터랙티브 버튼</h3>
          <InteractiveButton />
        </div>

        <div>
          <h3>🕒 실시간 시계</h3>
          <AnimatedClock />
        </div>

        <div>
          <h3>⏳ 로딩 스피너</h3>
          <LoadingSpinners />
        </div>
      </div>
    </div>
  );
}
