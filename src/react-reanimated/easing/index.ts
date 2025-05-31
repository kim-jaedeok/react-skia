// Easing functions for React Native Reanimated Web Port
// Based on React Native Reanimated easing functions
import type { EasingFunction } from "../types";

export const Easing = {
  linear: (t: number): number => t,

  ease: (t: number): number => {
    return t * t * (3 - 2 * t);
  },

  quad: (t: number): number => t * t,

  cubic: (t: number): number => t * t * t,

  poly: (n: number): EasingFunction => {
    return (t: number) => Math.pow(t, n);
  },

  sin: (t: number): number => {
    return 1 - Math.cos((t * Math.PI) / 2);
  },

  circle: (t: number): number => {
    return 1 - Math.sqrt(1 - t * t);
  },

  exp: (t: number): number => {
    return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
  },

  elastic: (bounciness: number = 1): EasingFunction => {
    const p = bounciness * Math.PI;
    return (t: number) => {
      return 1 - Math.pow(Math.cos((t * Math.PI) / 2), 3) * Math.cos(t * p);
    };
  },

  back: (s: number = 1.70158): EasingFunction => {
    return (t: number) => t * t * ((s + 1) * t - s);
  },

  bounce: (t: number): number => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    }
    if (t < 2 / 2.75) {
      const t2 = t - 1.5 / 2.75;
      return 7.5625 * t2 * t2 + 0.75;
    }
    if (t < 2.5 / 2.75) {
      const t2 = t - 2.25 / 2.75;
      return 7.5625 * t2 * t2 + 0.9375;
    }
    const t2 = t - 2.625 / 2.75;
    return 7.5625 * t2 * t2 + 0.984375;
  },

  // Bezier curves
  bezier: (x1: number, y1: number, x2: number, y2: number): EasingFunction => {
    const NEWTON_ITERATIONS = 4;
    const NEWTON_MIN_SLOPE = 0.001;
    const SUBDIVISION_PRECISION = 0.0000001;
    const SUBDIVISION_MAX_ITERATIONS = 10;

    const kSplineTableSize = 11;
    const kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

    function A(aA1: number, aA2: number) {
      return 1.0 - 3.0 * aA2 + 3.0 * aA1;
    }

    function B(aA1: number, aA2: number) {
      return 3.0 * aA2 - 6.0 * aA1;
    }

    function C(aA1: number) {
      return 3.0 * aA1;
    }

    function calcBezier(aT: number, aA1: number, aA2: number) {
      return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
    }

    function getSlope(aT: number, aA1: number, aA2: number) {
      return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
    }

    function binarySubdivide(
      aX: number,
      aA: number,
      aB: number,
      mX1: number,
      mX2: number,
    ) {
      let currentX,
        currentT,
        i = 0;
      do {
        currentT = aA + (aB - aA) / 2.0;
        currentX = calcBezier(currentT, mX1, mX2) - aX;
        if (currentX > 0.0) {
          aB = currentT;
        } else {
          aA = currentT;
        }
      } while (
        Math.abs(currentX) > SUBDIVISION_PRECISION &&
        ++i < SUBDIVISION_MAX_ITERATIONS
      );
      return currentT;
    }

    function newtonRaphsonIterate(
      aX: number,
      aGuessT: number,
      mX1: number,
      mX2: number,
    ) {
      for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
        const currentSlope = getSlope(aGuessT, mX1, mX2);
        if (currentSlope === 0.0) {
          return aGuessT;
        }
        const currentX = calcBezier(aGuessT, mX1, mX2) - aX;
        aGuessT -= currentX / currentSlope;
      }
      return aGuessT;
    }

    const sampleValues = new Float32Array(kSplineTableSize);

    if (x1 !== y1 || x2 !== y2) {
      for (let i = 0; i < kSplineTableSize; ++i) {
        sampleValues[i] = calcBezier(i * kSampleStepSize, x1, x2);
      }
    }

    function getTForX(aX: number) {
      let intervalStart = 0.0;
      let currentSample = 1;
      const lastSample = kSplineTableSize - 1;

      for (
        ;
        currentSample !== lastSample && sampleValues[currentSample] <= aX;
        ++currentSample
      ) {
        intervalStart += kSampleStepSize;
      }
      --currentSample;

      const dist =
        (aX - sampleValues[currentSample]) /
        (sampleValues[currentSample + 1] - sampleValues[currentSample]);
      const guessForT = intervalStart + dist * kSampleStepSize;

      const initialSlope = getSlope(guessForT, x1, x2);
      if (initialSlope >= NEWTON_MIN_SLOPE) {
        return newtonRaphsonIterate(aX, guessForT, x1, x2);
      } else if (initialSlope === 0.0) {
        return guessForT;
      } else {
        return binarySubdivide(
          aX,
          intervalStart,
          intervalStart + kSampleStepSize,
          x1,
          x2,
        );
      }
    }

    return function (t: number) {
      if (x1 === y1 && x2 === y2) {
        return t;
      }
      if (t === 0) {
        return 0;
      }
      if (t === 1) {
        return 1;
      }
      return calcBezier(getTForX(t), y1, y2);
    };
  },

  // Common presets
  in: (easing: EasingFunction): EasingFunction => easing,
  out:
    (easing: EasingFunction): EasingFunction =>
    (t: number) =>
      1 - easing(1 - t),
  inOut:
    (easing: EasingFunction): EasingFunction =>
    (t: number) =>
      t < 0.5 ? easing(t * 2) / 2 : 1 - easing((1 - t) * 2) / 2,
};

// Common easing presets
Easing.ease = Easing.bezier(0.25, 0.1, 0.25, 1);
Easing.quad = Easing.bezier(0.55, 0.085, 0.68, 0.53);
Easing.cubic = Easing.bezier(0.55, 0.055, 0.675, 0.19);
