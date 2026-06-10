'use client';

import { useEffects } from '@/contexts/EffectsContext';

/**
 * NoiseTexture — A full-viewport fixed overlay that renders an SVG noise filter
 * to add film grain / visual depth to the dark theme.
 *
 * - Uses an inline SVG feTurbulence filter (< 1KB, no external assets)
 * - Opacity between 0.02 and 0.05 for subtle grain effect
 * - pointer-events: none so it never blocks interaction
 * - z-index behind main content (decorative only)
 * - Reduced motion: remains static (grain is already static by nature)
 * - aria-hidden since it's purely decorative
 */
export default function NoiseTexture() {
  const { effectsEnabled } = useEffects();

  // Don't render if effects are globally disabled (e.g., quick view mode, performance fallback)
  if (!effectsEnabled) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
      style={{ opacity: 0.03 }}
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <filter id="noise-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#noise-filter)"
        />
      </svg>
    </div>
  );
}
