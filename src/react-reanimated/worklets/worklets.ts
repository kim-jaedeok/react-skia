// Worklet functions for React Native Reanimated Web Port
// Handles running code on UI thread vs JS thread
import type { WorkletFunction } from "../types";

/**
 * Marks a function to run on the JavaScript thread
 * In web environment, this is essentially a no-op since we're already on JS thread
 */
export function runOnJS<T extends WorkletFunction>(fn: T): T {
  return fn;
}

/**
 * Marks a function to run on the UI thread
 * In web environment, this runs in the main thread (same as JS thread)
 */
export function runOnUI<T extends WorkletFunction>(fn: T): T {
  return fn;
}

/**
 * Creates a worklet function
 * In React Native, this would compile to run on UI thread
 * In web, it's just a regular function
 */
export function worklet<T extends WorkletFunction>(fn: T): T {
  return fn;
}

/**
 * Utility to check if code is running on UI thread
 * Always returns true in web environment
 */
export function isUIThread(): boolean {
  return true;
}

/**
 * Utility to check if code is running on JS thread
 * Always returns true in web environment
 */
export function isJSThread(): boolean {
  return true;
}
