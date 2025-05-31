import { useEffect } from "react";

import { Circle, Group, SkiaCanvas, Text } from "../../react-skia";
import { Easing, useSharedValue } from "../../react-skia/hooks/useSharedValue";

export function AnimatedDemo() {
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Continuous translation animation
    const animateTranslation = () => {
      translateX.withTiming(200, {
        duration: 2000,
        easing: Easing.easeInOut,
      });

      setTimeout(() => {
        translateX.withTiming(0, {
          duration: 2000,
          easing: Easing.easeInOut,
        });
      }, 2000);
    };

    // Scale animation
    const animateScale = () => {
      scale.withTiming(1.5, {
        duration: 1000,
        easing: Easing.bounce,
      });

      setTimeout(() => {
        scale.withTiming(1, {
          duration: 1000,
          easing: Easing.bounce,
        });
      }, 1000);
    };

    // Rotation animation
    const animateRotation = () => {
      rotation.withTiming(360, {
        duration: 3000,
        easing: Easing.linear,
      });
    };

    // Opacity animation
    const animateOpacity = () => {
      opacity.withTiming(0.3, {
        duration: 1500,
        easing: Easing.easeInOut,
      });

      setTimeout(() => {
        opacity.withTiming(1, {
          duration: 1500,
          easing: Easing.easeInOut,
        });
      }, 1500);
    };

    // Start animations with different delays
    animateTranslation();
    setTimeout(animateScale, 500);
    setTimeout(animateRotation, 1000);
    setTimeout(animateOpacity, 1500);

    // Repeat animations
    const interval = setInterval(() => {
      animateTranslation();
      setTimeout(animateScale, 500);
      setTimeout(animateRotation, 1000);
      setTimeout(animateOpacity, 1500);
    }, 4000);

    return () => clearInterval(interval);
  }, [translateX, scale, rotation, opacity]);

  return (
    <div>
      <h3>애니메이션 데모</h3>
      <SkiaCanvas width={400} height={200}>
        {/* Animated Circle */}
        <Group
          transform={[scale.value, 0, 0, scale.value, translateX.value, 0]}
          opacity={opacity.value}
        >
          <Circle cx={50} cy={100} r={30} color="#FF6B6B" />
        </Group>

        {/* Static reference circle */}
        <Circle
          cx={50}
          cy={100}
          r={30}
          color="#E8E8E8"
          style="stroke"
          strokeWidth={2}
        />

        {/* Animation labels */}
        <Text x={10} y={30} text="애니메이션:" fontSize={14} color="#333" />
        <Text
          x={10}
          y={50}
          text="• 이동, 크기, 투명도"
          fontSize={12}
          color="#666"
        />
      </SkiaCanvas>
    </div>
  );
}
