// Animation functions for React Native Reanimated Web Port
// Core animation functions like withTiming, withSpring, withRepeat, etc.
import { Easing } from "./easing";
import type {
  AnimationCallback,
  AnimationState,
  EasingFunction,
  SharedValue,
  WithSpringConfig,
  WithTimingConfig,
} from "./types";

// Global animation state management
const activeAnimations = new Map<SharedValue<any>, AnimationState>();
let animationId = 0;

/**
 * Cancels any active animation on the given shared value
 */
export function cancelAnimation(sharedValue: SharedValue<any>): void {
  const animation = activeAnimations.get(sharedValue);
  if (animation) {
    animation.cancelled = true;
    activeAnimations.delete(sharedValue);

    if (animation.callback) {
      animation.callback(false);
    }
  }
}

/**
 * Animates a shared value to a target value over time
 * Similar to React Native Reanimated's withTiming
 */
export function withTiming<T>(
  toValue: T,
  config?: WithTimingConfig,
  callback?: AnimationCallback,
): T {
  const { duration = 300, easing = Easing.bezier(0.25, 0.1, 0.25, 1) } =
    config || {};

  // This function returns the animation configuration
  // The actual animation logic will be handled by the shared value
  return {
    __animationType: "timing",
    toValue,
    duration,
    easing,
    callback,
  } as any;
}

/**
 * Animates a shared value using spring physics
 * Similar to React Native Reanimated's withSpring
 */
export function withSpring<T>(
  toValue: T,
  config?: WithSpringConfig,
  callback?: AnimationCallback,
): T {
  const {
    damping = 10,
    mass = 1,
    stiffness = 100,
    overshootClamping = false,
    restDisplacementThreshold = 0.01,
    restSpeedThreshold = 2,
  } = config || {};

  return {
    __animationType: "spring",
    toValue,
    damping,
    mass,
    stiffness,
    overshootClamping,
    restDisplacementThreshold,
    restSpeedThreshold,
    callback,
  } as any;
}

/**
 * Repeats an animation a specified number of times
 * Similar to React Native Reanimated's withRepeat
 */
export function withRepeat<T>(
  animation: T,
  numberOfReps: number = -1,
  reverse: boolean = false,
  callback?: AnimationCallback,
): T {
  return {
    __animationType: "repeat",
    animation,
    numberOfReps,
    reverse,
    callback,
  } as any;
}

/**
 * Runs animations in sequence
 * Similar to React Native Reanimated's withSequence
 */
export function withSequence<T>(...animations: T[]): T {
  return {
    __animationType: "sequence",
    animations,
  } as any;
}

/**
 * Delays an animation
 * Similar to React Native Reanimated's withDelay
 */
export function withDelay<T>(
  delayMs: number,
  animation: T,
  callback?: AnimationCallback,
): T {
  return {
    __animationType: "delay",
    delayMs,
    animation,
    callback,
  } as any;
}

/**
 * Internal function to start a timing animation
 */
export function startTimingAnimation(
  sharedValue: SharedValue<number>,
  toValue: number,
  duration: number,
  easing: EasingFunction,
  callback?: AnimationCallback,
): void {
  // Cancel any existing animation
  cancelAnimation(sharedValue);

  const startTime = performance.now();
  const startValue = sharedValue.value;
  const id = animationId++;

  const animationState: AnimationState = {
    id,
    startTime,
    current: startValue,
    toValue,
    config: { duration, easing },
    callback,
    finished: false,
    cancelled: false,
  };

  activeAnimations.set(sharedValue, animationState);

  const animate = (currentTime: number) => {
    if (animationState.cancelled) {
      return;
    }

    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);

    const currentValue = startValue + (toValue - startValue) * easedProgress;
    if (sharedValue._internalSetValue) {
      sharedValue._internalSetValue(currentValue);
    } else {
      sharedValue.value = currentValue;
    }

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      animationState.finished = true;
      activeAnimations.delete(sharedValue);

      // Mark animation as finished
      if (sharedValue._setAnimationFinished) {
        sharedValue._setAnimationFinished();
      }

      if (callback) {
        callback(true);
      }
    }
  };

  requestAnimationFrame(animate);
}

/**
 * Internal function to start a spring animation
 */
export function startSpringAnimation(
  sharedValue: SharedValue<number>,
  toValue: number,
  config: WithSpringConfig,
  callback?: AnimationCallback,
): void {
  // Cancel any existing animation
  cancelAnimation(sharedValue);

  const {
    damping = 10,
    mass = 1,
    stiffness = 100,
    restDisplacementThreshold = 0.01,
    restSpeedThreshold = 2,
  } = config;

  const startTime = performance.now();
  const id = animationId++;

  let lastTime = startTime;
  let velocity = 0;
  let currentValue = sharedValue.value;

  const animationState: AnimationState = {
    id,
    startTime,
    current: currentValue,
    toValue,
    config,
    callback,
    finished: false,
    cancelled: false,
  };

  activeAnimations.set(sharedValue, animationState);

  const animate = (currentTime: number) => {
    if (animationState.cancelled) {
      return;
    }

    const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.016);
    lastTime = currentTime;

    const displacement = currentValue - toValue;
    const springForce = -stiffness * displacement;
    const dampingForce = -damping * velocity;
    const acceleration = (springForce + dampingForce) / mass;

    velocity += acceleration * deltaTime;
    currentValue += velocity * deltaTime;

    if (sharedValue._internalSetValue) {
      sharedValue._internalSetValue(currentValue);
    } else {
      sharedValue.value = currentValue;
    }

    // Check if animation should continue
    const hasSignificantMotion =
      Math.abs(velocity) > restSpeedThreshold ||
      Math.abs(displacement) > restDisplacementThreshold;

    if (hasSignificantMotion) {
      requestAnimationFrame(animate);
    } else {
      // Snap to final value
      if (sharedValue._internalSetValue) {
        sharedValue._internalSetValue(toValue);
      } else {
        sharedValue.value = toValue;
      }
      animationState.finished = true;
      activeAnimations.delete(sharedValue);

      // Mark animation as finished
      if (sharedValue._setAnimationFinished) {
        sharedValue._setAnimationFinished();
      }

      if (callback) {
        callback(true);
      }
    }
  };

  requestAnimationFrame(animate);
}
