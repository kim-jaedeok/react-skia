// useSharedValue hook for React Native Reanimated Web Port
// Core hook that manages animated values
import { useCallback, useEffect, useRef, useState } from "react";

import { startSpringAnimation, startTimingAnimation } from "../animations";
import type { SharedValue } from "../types";

/**
 * Creates a shared value that can be animated and shared between components
 * Similar to React Native Reanimated's useSharedValue
 */
export function useSharedValue<T = number>(initialValue: T): SharedValue<T> {
  const [, forceUpdate] = useState({});
  const valueRef = useRef<T>(initialValue);
  const listenersRef = useRef<Map<string, (value: T) => void>>(new Map());
  const listenerIdRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const animationCleanupRef = useRef<(() => void) | null>(null);

  // Force re-render when value changes (but not during animations)
  const triggerUpdate = useCallback(() => {
    if (!isAnimatingRef.current) {
      forceUpdate({});
    }
  }, []);

  // Cleanup function for component unmount
  useEffect(() => {
    return () => {
      // Clear all listeners
      listenersRef.current.clear();

      // Stop any ongoing animations
      if (animationCleanupRef.current) {
        animationCleanupRef.current();
        animationCleanupRef.current = null;
      }

      // Reset animation state
      isAnimatingRef.current = false;
    };
  }, []);

  // Notify all listeners when value changes
  const notifyListeners = useCallback((newValue: T) => {
    listenersRef.current.forEach(listener => {
      try {
        listener(newValue);
      } catch (error) {
        console.error("Error in SharedValue listener:", error);
      }
    });
  }, []);

  const sharedValue: SharedValue<T> = {
    get value() {
      return valueRef.current;
    },
    set value(newValue: T | any) {
      // Handle animation objects for number types only
      if (
        newValue &&
        typeof newValue === "object" &&
        newValue.__animationType
      ) {
        if (typeof valueRef.current === "number") {
          isAnimatingRef.current = true;
          // Clear previous animation cleanup if exists
          if (animationCleanupRef.current) {
            animationCleanupRef.current();
          }
          // Store new animation cleanup
          animationCleanupRef.current = handleAnimation(
            sharedValue as any,
            newValue,
          );
        }
        return;
      }

      // Handle normal value updates
      if (valueRef.current !== newValue) {
        valueRef.current = newValue;
        triggerUpdate();
        notifyListeners(newValue);
      }
    },

    addListener: (listener: (value: T) => void) => {
      const id = `listener_${listenerIdRef.current++}`;
      listenersRef.current.set(id, listener);
      return id;
    },

    removeListener: (listenerId: string) => {
      listenersRef.current.delete(listenerId);
    },

    modify: (modifier: (value: T) => T) => {
      const newValue = modifier(valueRef.current);
      sharedValue.value = newValue;
    },

    // Internal method for animations to update value without triggering re-renders
    _internalSetValue: (newValue: T) => {
      if (valueRef.current !== newValue) {
        valueRef.current = newValue;
        notifyListeners(newValue);
      }
    },

    // Method to mark animation as finished
    _setAnimationFinished: () => {
      isAnimatingRef.current = false;
      triggerUpdate();
    },
  };

  return sharedValue;
}

/**
 * Internal function to handle animation objects
 */
function handleAnimation(
  sharedValue: SharedValue<number>,
  animationConfig: any,
): (() => void) | null {
  const { __animationType } = animationConfig;

  switch (__animationType) {
    case "timing":
      return startTimingAnimation(
        sharedValue,
        animationConfig.toValue,
        animationConfig.duration,
        animationConfig.easing,
        animationConfig.callback,
      );

    case "spring":
      return startSpringAnimation(
        sharedValue,
        animationConfig.toValue,
        animationConfig,
        animationConfig.callback,
      );

    case "repeat":
      handleRepeatAnimation(sharedValue, animationConfig);
      return null; // TODO: Implement cleanup for repeat animations

    case "sequence":
      handleSequenceAnimation(sharedValue, animationConfig);
      return null; // TODO: Implement cleanup for sequence animations

    case "delay":
      handleDelayAnimation(sharedValue, animationConfig);
      return null; // TODO: Implement cleanup for delay animations

    default:
      console.warn("Unknown animation type:", __animationType);
      return null;
  }
}

/**
 * Handle repeat animations
 */
function handleRepeatAnimation(sharedValue: SharedValue<number>, config: any) {
  const { animation, numberOfReps, reverse, callback } = config;
  let currentRep = 0;
  const isInfinite = numberOfReps === -1;

  const runAnimation = (isReversed: boolean = false) => {
    const animationConfig = { ...animation };

    if (isReversed && animationConfig.__animationType === "timing") {
      // For reversed timing animations, swap start and end values
      // Note: This is a simplified approach for demonstration
      animationConfig.toValue = sharedValue.value;
    }

    // Set up callback for when this rep finishes
    const originalCallback = animationConfig.callback;
    animationConfig.callback = (finished: boolean) => {
      if (originalCallback) {
        originalCallback(finished);
      }

      if (finished && !isInfinite) {
        currentRep++;

        if (currentRep < numberOfReps) {
          // Run next repetition
          const shouldReverse = reverse && currentRep % 2 === 1;
          setTimeout(() => runAnimation(shouldReverse), 0);
        } else if (callback) {
          callback(true);
        }
      } else if (finished && isInfinite) {
        // Infinite repeat
        const shouldReverse = reverse && currentRep % 2 === 1;
        currentRep++;
        setTimeout(() => runAnimation(shouldReverse), 0);
      }
    };

    handleAnimation(sharedValue, animationConfig);
  };

  runAnimation();
}

/**
 * Handle sequence animations
 */
function handleSequenceAnimation(
  sharedValue: SharedValue<number>,
  config: any,
) {
  const { animations } = config;
  let currentIndex = 0;

  const runNextAnimation = () => {
    if (currentIndex >= animations.length) {
      return;
    }

    const animation = animations[currentIndex];
    const animationConfig = { ...animation };

    // Set up callback for when this animation finishes
    const originalCallback = animationConfig.callback;
    animationConfig.callback = (finished: boolean) => {
      if (originalCallback) {
        originalCallback(finished);
      }

      if (finished) {
        currentIndex++;
        if (currentIndex < animations.length) {
          setTimeout(runNextAnimation, 0);
        }
      }
    };

    handleAnimation(sharedValue, animationConfig);
  };

  runNextAnimation();
}

/**
 * Handle delayed animations
 */
function handleDelayAnimation(sharedValue: SharedValue<number>, config: any) {
  const { delayMs, animation, callback } = config;

  setTimeout(() => {
    const animationConfig = { ...animation };

    // Set up callback
    const originalCallback = animationConfig.callback;
    animationConfig.callback = (finished: boolean) => {
      if (originalCallback) {
        originalCallback(finished);
      }
      if (callback) {
        callback(finished);
      }
    };

    handleAnimation(sharedValue, animationConfig);
  }, delayMs);
}
