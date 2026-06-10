'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useEffects } from '@/contexts/EffectsContext';

interface PerformanceState {
  fps: number;
  shouldDisableEffects: boolean;
}

const WINDOW_SIZE = 30;
const LOW_FPS_THRESHOLD = 30;
const CRITICAL_FPS_THRESHOLD = 20;
const CRITICAL_DURATION_MS = 1000;

/**
 * Monitors frame rate using a rolling window of 30 frame samples.
 * - Average FPS < 30 over 30 frames → triggers a single performance tier downgrade
 * - Tier is "low" and average FPS < 20 for >1000ms → disables all effects
 * - Pauses monitoring when overlayActive or effects are disabled
 */
export function usePerformanceMonitor(): PerformanceState {
  const {
    reportPerformanceDrop,
    disableEffects,
    performanceTier,
    overlayActive,
    effectsEnabled,
  } = useEffects();

  const fpsRef = useRef(60);
  const rafRef = useRef<number>(0);
  const frameSamples = useRef<number[]>([]);
  const lastFrameTime = useRef<number>(0);
  const criticalStartTime = useRef<number | null>(null);
  const hasTriggeredDowngrade = useRef(false);

  const calculateAverageFps = useCallback((samples: number[]): number => {
    if (samples.length === 0) return 60;
    const avgFrameTime = samples.reduce((sum, t) => sum + t, 0) / samples.length;
    return avgFrameTime > 0 ? 1000 / avgFrameTime : 60;
  }, []);

  useEffect(() => {
    // Pause monitoring when overlay is active or effects are disabled
    if (overlayActive || !effectsEnabled) return;

    // Reset state on mount/re-enable
    frameSamples.current = [];
    lastFrameTime.current = 0;
    criticalStartTime.current = null;
    hasTriggeredDowngrade.current = false;

    const loop = (now: number) => {
      if (lastFrameTime.current > 0) {
        const delta = now - lastFrameTime.current;

        // Only record reasonable frame times (skip large spikes from tab switch)
        if (delta > 0 && delta < 500) {
          frameSamples.current.push(delta);

          // Maintain rolling window of WINDOW_SIZE samples
          if (frameSamples.current.length > WINDOW_SIZE) {
            frameSamples.current.shift();
          }

          // Only evaluate once we have a full window
          if (frameSamples.current.length === WINDOW_SIZE) {
            const avgFps = calculateAverageFps(frameSamples.current);
            fpsRef.current = Math.round(avgFps);

            // Check critical condition: low tier + FPS < 20 for >1000ms
            if (performanceTier === 'low' && avgFps < CRITICAL_FPS_THRESHOLD) {
              if (criticalStartTime.current === null) {
                criticalStartTime.current = now;
              } else if (now - criticalStartTime.current > CRITICAL_DURATION_MS) {
                disableEffects();
                criticalStartTime.current = null;
                return; // Stop the loop - effects are disabled
              }
            } else {
              criticalStartTime.current = null;
            }

            // Trigger single downgrade when average FPS < 30
            if (avgFps < LOW_FPS_THRESHOLD && !hasTriggeredDowngrade.current) {
              reportPerformanceDrop();
              hasTriggeredDowngrade.current = true;
              // Reset the window to avoid repeated triggers on same data
              frameSamples.current = [];
            }

            // Reset downgrade flag once FPS recovers
            if (avgFps >= LOW_FPS_THRESHOLD) {
              hasTriggeredDowngrade.current = false;
            }
          }
        }
      }

      lastFrameTime.current = now;
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [
    effectsEnabled,
    overlayActive,
    performanceTier,
    reportPerformanceDrop,
    disableEffects,
    calculateAverageFps,
  ]);

  return {
    fps: fpsRef.current,
    shouldDisableEffects: !effectsEnabled,
  };
}
