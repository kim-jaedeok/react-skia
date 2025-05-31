// useAnimatedStyle hook for React Native Reanimated Web Port
// Creates animated styles for React components
import { useMemo } from "react";

import type { AnimatedStyleProp, SharedValue, WorkletFunction } from "../types";
import { useDerivedValue } from "./useDerivedValue";

/**
 * Creates animated styles that update automatically when shared values change
 * Similar to React Native Reanimated's useAnimatedStyle
 */
export function useAnimatedStyle<T extends AnimatedStyleProp>(
  updater: WorkletFunction,
  dependencies?: SharedValue<any>[],
): T {
  const derivedStyle = useDerivedValue(updater, dependencies);

  // Memoize the style object to prevent unnecessary re-renders
  const animatedStyle = useMemo(() => {
    return derivedStyle.value as T;
  }, [derivedStyle.value]);

  return animatedStyle;
}

/**
 * Utility function to create animated props for any component
 * Useful for animating non-style properties
 */
export function useAnimatedProps<T>(
  updater: WorkletFunction,
  dependencies?: SharedValue<any>[],
): T {
  const derivedProps = useDerivedValue(updater, dependencies);

  const animatedProps = useMemo(() => {
    return derivedProps.value as T;
  }, [derivedProps.value]);

  return animatedProps;
}
