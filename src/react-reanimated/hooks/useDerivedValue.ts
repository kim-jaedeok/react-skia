// useDerivedValue hook for React Native Reanimated Web Port
// Creates computed values based on other shared values
import { useEffect, useRef } from "react";

import type { SharedValue, WorkletFunction } from "../types";
import { useSharedValue } from "./useSharedValue";

/**
 * Creates a derived value that updates automatically when dependencies change
 * Similar to React Native Reanimated's useDerivedValue
 */
export function useDerivedValue<T>(
  updater: WorkletFunction,
  dependencies?: SharedValue<any>[],
): SharedValue<T> {
  const derivedValue = useSharedValue<T>(updater());
  const updaterRef = useRef(updater);
  const dependenciesRef = useRef(dependencies);

  // Update refs when props change
  updaterRef.current = updater;
  dependenciesRef.current = dependencies;

  useEffect(() => {
    if (!dependencies || dependencies.length === 0) {
      return;
    }

    const listenerIds: string[] = [];

    // Add listeners to all dependencies
    dependencies.forEach(dep => {
      if (dep.addListener) {
        const listenerId = dep.addListener(() => {
          try {
            const newValue = updaterRef.current();
            derivedValue.value = newValue;
          } catch (error) {
            console.error("Error in derived value updater:", error);
          }
        });
        listenerIds.push(listenerId);
      }
    });

    // Cleanup listeners on unmount or dependency change
    return () => {
      dependencies.forEach((dep, index) => {
        if (dep.removeListener && listenerIds[index]) {
          dep.removeListener(listenerIds[index]);
        }
      });
    };
  }, [dependencies, derivedValue]);

  return derivedValue;
}
