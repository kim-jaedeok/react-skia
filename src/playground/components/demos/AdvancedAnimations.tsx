import { useEffect, useMemo } from "react";

import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "../../../react-reanimated";
import {
  Circle,
  Group,
  Path,
  Rect,
  SkiaCanvas,
  Text,
} from "../../../react-skia";

// 복잡한 궤도 애니메이션
function OrbitAnimation() {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    // 회전 애니메이션
    rotation.value = withRepeat(
      withTiming(360, { duration: 4000, easing: Easing.linear }),
      -1,
      false,
    );

    // 크기 변화 애니메이션
    scale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.7, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, []);

  // 궤도 계산
  const centerX = 175;
  const centerY = 100;
  const orbitRadius = 60;

  const satelliteX = useDerivedValue<number>(() => {
    const rad = (rotation.value * Math.PI) / 180;
    return centerX + Math.cos(rad) * orbitRadius;
  }, [rotation]);

  const satelliteY = useDerivedValue<number>(() => {
    const rad = (rotation.value * Math.PI) / 180;
    return centerY + Math.sin(rad) * orbitRadius;
  }, [rotation]);

  return (
    <SkiaCanvas width={350} height={200}>
      {/* 궤도 표시 */}
      <Circle
        cx={centerX}
        cy={centerY}
        r={orbitRadius}
        color="#E8E8E8"
        style="stroke"
        strokeWidth={1}
      />

      {/* 중심 행성 */}
      <Group transform={[scale.value, 0, 0, scale.value, centerX, centerY]}>
        <Circle cx={0} cy={0} r={15} color="#FF6B6B" />
      </Group>

      {/* 위성 */}
      <Circle
        cx={satelliteX.value}
        cy={satelliteY.value}
        r={8}
        color="#4ECDC4"
      />

      {/* 궤적 표시 */}
      <Group opacity={0.3}>
        <Circle
          cx={satelliteX.value}
          cy={satelliteY.value}
          r={2}
          color="#4ECDC4"
        />
      </Group>

      <Text x={10} y={20} text="궤도 애니메이션" fontSize={14} color="#666" />
      <Text x={10} y={180} text="회전 + 크기 변화" fontSize={12} color="#999" />
    </SkiaCanvas>
  );
}

// 스프링 물리 시뮬레이션
function SpringPhysics() {
  const ballY = useSharedValue(50);
  const squashScale = useSharedValue(1);

  useEffect(() => {
    // 공 떨어뜨리기 애니메이션 (스프링 물리)
    const dropBall = () => {
      ballY.value = withSpring(140, {
        damping: 0.6,
        stiffness: 100,
        mass: 1,
      });

      // 압축 효과
      squashScale.value = withSequence(
        withDelay(800, withTiming(0.8, { duration: 100 })),
        withTiming(1.2, { duration: 100 }),
        withTiming(1, { duration: 200 }),
      );
    };

    const resetBall = () => {
      ballY.value = withTiming(50, { duration: 300 });
      squashScale.value = withTiming(1, { duration: 300 });
    };

    dropBall();
    const interval = setInterval(() => {
      setTimeout(resetBall, 1500);
      setTimeout(dropBall, 2000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SkiaCanvas width={350} height={200}>
      {/* 그라운드 */}
      <Rect x={0} y={160} width={350} height={40} color="#8B4513" />

      {/* 공 */}
      <Group
        transform={[
          squashScale.value,
          0,
          0,
          squashScale.value,
          175,
          ballY.value,
        ]}
      >
        <Circle cx={0} cy={0} r={20} color="#FF6B6B" />
      </Group>

      <Text
        x={10}
        y={20}
        text="스프링 물리 시뮬레이션"
        fontSize={14}
        color="#666"
      />
      <Text x={10} y={40} text="탄성 + 압축 효과" fontSize={12} color="#999" />
    </SkiaCanvas>
  );
}

// 웨이브 애니메이션
function WaveAnimation() {
  const phase = useSharedValue(0);
  const amplitude = useSharedValue(20);

  useEffect(() => {
    phase.value = withRepeat(
      withTiming(Math.PI * 4, { duration: 3000, easing: Easing.linear }),
      -1,
      false,
    );

    amplitude.value = withRepeat(
      withSequence(
        withTiming(30, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        withTiming(10, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, []);

  // 웨이브 경로 생성
  const wavePath = useDerivedValue<string>(() => {
    const points: string[] = [];
    const width = 350;
    const centerY = 100;
    const segments = 50;

    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * width;
      const waveX = (i / segments) * Math.PI * 4 + phase.value;
      const y = centerY + Math.sin(waveX) * amplitude.value;

      if (i === 0) {
        points.push(`M ${x} ${y}`);
      } else {
        points.push(`L ${x} ${y}`);
      }
    }

    return points.join(" ");
  }, [phase, amplitude]);

  return (
    <SkiaCanvas width={350} height={200}>
      {/* 웨이브 */}
      <Path
        path={wavePath.value}
        color="#4ECDC4"
        style="stroke"
        strokeWidth={3}
      />

      {/* 중심선 */}
      <Path
        path="M 0 100 L 350 100"
        color="#E8E8E8"
        style="stroke"
        strokeWidth={1}
      />

      <Text x={10} y={20} text="웨이브 애니메이션" fontSize={14} color="#666" />
      <Text
        x={10}
        y={180}
        text="sin 함수 + 진폭 변화"
        fontSize={12}
        color="#999"
      />
    </SkiaCanvas>
  );
}

// 파티클 시스템
function ParticleSystem() {
  // Create shared values at the top level
  const particleXValues = Array.from({ length: 20 }, () => useSharedValue(175));
  const particleYValues = Array.from({ length: 20 }, () => useSharedValue(100));
  const particleOpacityValues = Array.from({ length: 20 }, () =>
    useSharedValue(1),
  );
  const particleScaleValues = Array.from({ length: 20 }, () =>
    useSharedValue(1),
  );

  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: particleXValues[i],
        y: particleYValues[i],
        opacity: particleOpacityValues[i],
        scale: particleScaleValues[i],
      })),
    [
      particleXValues,
      particleYValues,
      particleOpacityValues,
      particleScaleValues,
    ],
  );

  useEffect(() => {
    const animateParticles = () => {
      particles.forEach((particle, i) => {
        const angle = (i / particles.length) * Math.PI * 2;
        const distance = 80 + Math.random() * 40;
        const targetX = 175 + Math.cos(angle) * distance;
        const targetY = 100 + Math.sin(angle) * distance;

        // 위치 애니메이션
        particle.x.value = withTiming(targetX, {
          duration: 1500 + Math.random() * 1000,
          easing: Easing.out(Easing.quad),
        });
        particle.y.value = withTiming(targetY, {
          duration: 1500 + Math.random() * 1000,
          easing: Easing.out(Easing.quad),
        });

        // 투명도 애니메이션
        particle.opacity.value = withSequence(
          withDelay(i * 50, withTiming(1, { duration: 200 })),
          withDelay(1000, withTiming(0, { duration: 1000 })),
        );

        // 크기 애니메이션
        particle.scale.value = withSequence(
          withTiming(1.5, { duration: 500, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 1500, easing: Easing.in(Easing.quad) }),
        );
      });
    };

    const resetParticles = () => {
      particles.forEach(particle => {
        particle.x.value = 175;
        particle.y.value = 100;
        particle.opacity.value = 1;
        particle.scale.value = 1;
      });
    };

    animateParticles();
    const interval = setInterval(() => {
      resetParticles();
      setTimeout(animateParticles, 100);
    }, 3000);

    return () => clearInterval(interval);
  }, [particles]);

  return (
    <SkiaCanvas width={350} height={200}>
      {/* 중심점 */}
      <Circle cx={175} cy={100} r={5} color="#FF6B6B" />

      {/* 파티클들 */}
      {particles.map(particle => (
        <Group
          key={particle.id}
          opacity={particle.opacity.value}
          transform={[
            particle.scale.value,
            0,
            0,
            particle.scale.value,
            particle.x.value,
            particle.y.value,
          ]}
        >
          <Circle cx={0} cy={0} r={4} color="#4ECDC4" />
        </Group>
      ))}

      <Text x={10} y={20} text="파티클 시스템" fontSize={14} color="#666" />
      <Text x={10} y={180} text="방사형 폭발 효과" fontSize={12} color="#999" />
    </SkiaCanvas>
  );
}

export function AdvancedAnimations() {
  return (
    <div>
      <h2>🚀 고급 애니메이션 데모</h2>
      <p>React Reanimated 웹 포트를 사용한 복잡한 애니메이션들</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div>
          <h3>🌍 궤도 애니메이션</h3>
          <OrbitAnimation />
        </div>

        <div>
          <h3>⚽ 스프링 물리</h3>
          <SpringPhysics />
        </div>

        <div>
          <h3>🌊 웨이브</h3>
          <WaveAnimation />
        </div>

        <div>
          <h3>✨ 파티클 시스템</h3>
          <ParticleSystem />
        </div>
      </div>
    </div>
  );
}
