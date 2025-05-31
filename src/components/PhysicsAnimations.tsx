import React from "react";

import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "../react-reanimated";
import { Circle, Group, Path, Rect, SkiaCanvas, Text } from "../skia";

// 물리 기반 진자 시뮬레이션
function PendulumSimulation() {
  const angle = useSharedValue(45); // 초기 각도

  React.useEffect(() => {
    // 진자의 물리적 운동 시뮬레이션
    angle.value = withRepeat(
      withSequence(
        withSpring(-45, {
          damping: 2,
          stiffness: 50,
          mass: 1,
        }),
        withSpring(45, {
          damping: 2,
          stiffness: 50,
          mass: 1,
        }),
      ),
      -1,
      false,
    );
  }, []);

  const pendulumLength = 80;
  const centerX = 175;
  const centerY = 40;

  // 진자 끝점 위치 계산
  const bobX = useDerivedValue<number>(() => {
    const rad = (angle.value * Math.PI) / 180;
    return centerX + Math.sin(rad) * pendulumLength;
  }, [angle]);

  const bobY = useDerivedValue<number>(() => {
    const rad = (angle.value * Math.PI) / 180;
    return centerY + Math.cos(rad) * pendulumLength;
  }, [angle]);

  return (
    <SkiaCanvas width={350} height={200}>
      {/* 고정점 */}
      <Circle cx={centerX} cy={centerY} r={3} color="#2C3E50" />

      {/* 진자 줄 */}
      <Path
        path={`M ${centerX} ${centerY} L ${bobX.value} ${bobY.value}`}
        color="#34495E"
        style="stroke"
        strokeWidth={2}
      />

      {/* 진자 추 */}
      <Circle cx={bobX.value} cy={bobY.value} r={12} color="#E74C3C" />

      {/* 궤적 표시 */}
      <Path
        path={`M ${centerX - 60} ${centerY + 70} Q ${centerX} ${centerY + 90} ${centerX + 60} ${centerY + 70}`}
        color="#BDC3C7"
        style="stroke"
        strokeWidth={1}
      />

      <Text
        x={10}
        y={20}
        text="물리 진자 시뮬레이션"
        fontSize={14}
        color="#666"
      />
      <Text
        x={10}
        y={180}
        text="스프링 물리 기반 애니메이션"
        fontSize={12}
        color="#999"
      />
    </SkiaCanvas>
  );
}

// 중력 떨어지는 공 시뮬레이션
function GravitySimulation() {
  const ballY = useSharedValue(30);
  const ballX = useSharedValue(50);
  const [isDropping, setIsDropping] = React.useState(false);

  React.useEffect(() => {
    // 자동으로 중력 시뮬레이션 시작
    const startSimulation = () => {
      setIsDropping(true);

      // 물리적으로 정확한 자유낙하
      ballY.value = withSpring(150, {
        damping: 8,
        stiffness: 100,
        mass: 1,
      });

      // 횡방향 이동
      ballX.value = withTiming(300, {
        duration: 1500,
        easing: Easing.linear,
      });

      setTimeout(() => {
        // 리셋
        ballY.value = withTiming(30, { duration: 500 });
        ballX.value = withTiming(50, { duration: 500 });
        setIsDropping(false);
      }, 2000);
    };

    startSimulation();
    const interval = setInterval(startSimulation, 4000);

    return () => clearInterval(interval);
  }, [ballY, ballX]);

  return (
    <SkiaCanvas width={350} height={200}>
      {/* 배경 */}
      <Rect x={0} y={0} width={350} height={170} color="#87CEEB" />
      <Rect x={0} y={170} width={350} height={30} color="#8B4513" />

      {/* 떨어지는 공 */}
      <Circle cx={ballX.value} cy={ballY.value} r={10} color="#FF6B6B" />

      {/* 궤적 표시 (포물선) */}
      <Path
        path="M 50 30 Q 175 100 300 150"
        color="#FFF"
        style="stroke"
        strokeWidth={2}
      />

      {/* 드롭 버튼 */}
      <Group>
        <Rect
          x={10}
          y={160}
          width={60}
          height={25}
          color={isDropping ? "#95A5A6" : "#3498DB"}
        />
        <Text x={20} y={175} text="DROP" fontSize={10} color="white" />
      </Group>

      <Text x={10} y={20} text="중력 시뮬레이션" fontSize={14} color="#FFF" />
    </SkiaCanvas>
  );
}

// 복잡한 기어 시스템 애니메이션
function GearSystem() {
  const gear1Rotation = useSharedValue(0);
  const gear2Rotation = useSharedValue(0);
  const gear3Rotation = useSharedValue(0);

  React.useEffect(() => {
    // 기어 1 (큰 기어) - 가장 느림
    gear1Rotation.value = withRepeat(
      withTiming(360, { duration: 4000, easing: Easing.linear }),
      -1,
      false,
    );

    // 기어 2 (중간 기어) - 기어비 적용
    gear2Rotation.value = withRepeat(
      withTiming(-720, { duration: 4000, easing: Easing.linear }), // 반대방향, 2배 빠름
      -1,
      false,
    );

    // 기어 3 (작은 기어) - 가장 빠름
    gear3Rotation.value = withRepeat(
      withTiming(1080, { duration: 4000, easing: Easing.linear }), // 3배 빠름
      -1,
      false,
    );
  }, []);

  return (
    <SkiaCanvas width={350} height={200}>
      {/* 기어 1 (큰 기어) */}
      <Group transform={[1, 0, 0, 1, 100, 100]}>
        <Group
          transform={[
            Math.cos((gear1Rotation.value * Math.PI) / 180),
            -Math.sin((gear1Rotation.value * Math.PI) / 180),
            Math.sin((gear1Rotation.value * Math.PI) / 180),
            Math.cos((gear1Rotation.value * Math.PI) / 180),
            0,
            0,
          ]}
        >
          <Circle cx={0} cy={0} r={35} color="#34495E" />
          <Circle cx={0} cy={0} r={30} color="#2C3E50" />
          <Circle cx={0} cy={0} r={8} color="#BDC3C7" />
        </Group>
      </Group>

      {/* 기어 2 (중간 기어) */}
      <Group transform={[1, 0, 0, 1, 180, 80]}>
        <Group
          transform={[
            Math.cos((gear2Rotation.value * Math.PI) / 180),
            -Math.sin((gear2Rotation.value * Math.PI) / 180),
            Math.sin((gear2Rotation.value * Math.PI) / 180),
            Math.cos((gear2Rotation.value * Math.PI) / 180),
            0,
            0,
          ]}
        >
          <Circle cx={0} cy={0} r={25} color="#E67E22" />
          <Circle cx={0} cy={0} r={20} color="#D35400" />
          <Circle cx={0} cy={0} r={6} color="#BDC3C7" />
        </Group>
      </Group>

      {/* 기어 3 (작은 기어) */}
      <Group transform={[1, 0, 0, 1, 250, 100]}>
        <Group
          transform={[
            Math.cos((gear3Rotation.value * Math.PI) / 180),
            -Math.sin((gear3Rotation.value * Math.PI) / 180),
            Math.sin((gear3Rotation.value * Math.PI) / 180),
            Math.cos((gear3Rotation.value * Math.PI) / 180),
            0,
            0,
          ]}
        >
          <Circle cx={0} cy={0} r={20} color="#27AE60" />
          <Circle cx={0} cy={0} r={15} color="#229954" />
          <Circle cx={0} cy={0} r={5} color="#BDC3C7" />
        </Group>
      </Group>

      {/* 연결 체인/벨트 */}
      <Path
        path="M 135 100 Q 155 90 155 80"
        color="#7F8C8D"
        style="stroke"
        strokeWidth={3}
      />
      <Path
        path="M 205 80 Q 225 90 230 100"
        color="#7F8C8D"
        style="stroke"
        strokeWidth={3}
      />

      <Text x={10} y={20} text="기어 시스템" fontSize={14} color="#666" />
      <Text
        x={10}
        y={180}
        text="연동된 회전 애니메이션"
        fontSize={12}
        color="#999"
      />
    </SkiaCanvas>
  );
}

export function PhysicsAnimations() {
  return (
    <div>
      <h2>⚡ 물리 기반 애니메이션</h2>
      <p>실제 물리 법칙을 적용한 고급 애니메이션</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div>
          <h3>🎯 진자 운동</h3>
          <PendulumSimulation />
        </div>

        <div>
          <h3>🌍 중력 낙하</h3>
          <GravitySimulation />
        </div>

        <div>
          <h3>⚙️ 기어 시스템</h3>
          <GearSystem />
        </div>
      </div>
    </div>
  );
}
