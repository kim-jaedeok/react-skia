// Type definitions for React Native Reanimated Web Port

export interface SharedValue<T = number> {
  value: T;
  addListener?: (listener: (value: T) => void) => string;
  removeListener?: (listenerId: string) => void;
  modify?: (modifier: (value: T) => T) => void;
  // Internal methods for animations
  _internalSetValue?: (newValue: T) => void;
  _setAnimationFinished?: () => void;
}

export type AnimationCallback = (finished?: boolean) => void;

export interface WithTimingConfig {
  duration?: number;
  easing?: EasingFunction;
}

export interface WithSpringConfig {
  damping?: number;
  mass?: number;
  stiffness?: number;
  overshootClamping?: boolean;
  restDisplacementThreshold?: number;
  restSpeedThreshold?: number;
}

export interface WithRepeatConfig {
  numberOfReps?: number;
  reverse?: boolean;
}

export interface WithSequenceConfig {
  // Configuration for sequence animations
}

export interface WithDelayConfig {
  // Configuration for delayed animations
}

export type EasingFunction = (value: number) => number;

export interface AnimatedStyleProp {
  [key: string]: SharedValue<any> | number | string;
}

// Animation value types
export interface AnimationObject {
  callback?: AnimationCallback;
  current?: number;
  toValue?: number;
  startTime?: number;
  duration?: number;
  easing?: EasingFunction;
  finished?: boolean;
  cancelled?: boolean;
}

// Worklet types
export type WorkletFunction = (...args: any[]) => any;

// Internal animation state
export interface AnimationState {
  id: number;
  startTime: number;
  current: number;
  toValue: number;
  config: any;
  callback?: AnimationCallback;
  finished: boolean;
  cancelled: boolean;
}
