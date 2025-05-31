import { useState, useEffect, useRef } from 'react';

export interface AnimationConfig {
  duration: number;
  easing?: (t: number) => number;
  loop?: boolean;
  autoStart?: boolean;
}

export function useSharedValue(initialValue: number) {
  const [value, setValue] = useState(initialValue);
  const animationRef = useRef<number | null>(null);

  const withTiming = (toValue: number, config: AnimationConfig = { duration: 300 }) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startTime = Date.now();
    const { duration, easing = (t: number) => t, loop = false } = config;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);
      
      const currentValue = value + (toValue - value) * easedProgress;
      setValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else if (loop) {
        // Restart animation for loop
        const newStartTime = Date.now();
        const loopAnimate = () => {
          const loopElapsed = Date.now() - newStartTime;
          const loopProgress = Math.min(loopElapsed / duration, 1);
          const loopEasedProgress = easing(loopProgress);
          
          const loopValue = toValue + (value - toValue) * loopEasedProgress;
          setValue(loopValue);

          if (loopProgress < 1) {
            animationRef.current = requestAnimationFrame(loopAnimate);
          } else {
            // Restart the cycle
            withTiming(toValue, config);
          }
        };
        animationRef.current = requestAnimationFrame(loopAnimate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return { cancel: () => animationRef.current && cancelAnimationFrame(animationRef.current) };
  };

  const withSpring = (toValue: number, config: { stiffness?: number; damping?: number } = {}) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const { stiffness = 100, damping = 10 } = config;
    let velocity = 0;

    const animate = () => {
      const displacement = value - toValue;
      const springForce = -stiffness * displacement;
      const dampingForce = -damping * velocity;
      
      velocity += (springForce + dampingForce) * 0.016; // Assuming 60fps
      const newValue = value + velocity * 0.016;
      
      setValue(newValue);

      // Continue animation if there's still significant motion
      if (Math.abs(velocity) > 0.1 || Math.abs(displacement) > 0.1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return { cancel: () => animationRef.current && cancelAnimationFrame(animationRef.current) };
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    value,
    withTiming,
    withSpring,
  };
}

// Easing functions
export const Easing = {
  linear: (t: number) => t,
  ease: (t: number) => t * t * (3 - 2 * t),
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => 1 - (1 - t) * (1 - t),
  easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  bounce: (t: number) => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  },
};
