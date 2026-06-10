'use client';

import { useEffects } from '@/contexts/EffectsContext';

/**
 * AuroraBackground renders animated gradient blobs behind content.
 * Uses CSS keyframe animations with neon-blue/purple palette at low opacity (0.03-0.08).
 * Blurs 40-80px and cycles positions over 15-30 seconds.
 *
 * Performance tier handling:
 * - High/Medium: full animated blobs with GPU-accelerated CSS keyframes
 * - Low: static radial gradient (no animation)
 * - prefers-reduced-motion: static gradient (no animation)
 * - effectsEnabled === false: renders nothing
 */
export default function AuroraBackground() {
  const { reducedMotion, effectsEnabled, performanceTier } = useEffects();

  // Disabled: render nothing
  if (!effectsEnabled) return null;

  // Static gradient fallback for reduced motion OR low performance tier
  if (reducedMotion || performanceTier === 'low') {
    return (
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 30% 40%, rgba(0, 212, 255, 0.05) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(139, 92, 246, 0.04) 0%, transparent 60%), radial-gradient(ellipse at 50% 80%, rgba(0, 212, 255, 0.03) 0%, transparent 50%)',
          }}
        />
      </div>
    );
  }

  // Full animated blobs for high/medium performance tiers
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Blob 1 — neon-blue, top-left drift, 20s cycle */}
      <div
        className="absolute rounded-full animate-aurora-blob-1"
        style={{
          width: '400px',
          height: '400px',
          background:
            'radial-gradient(circle, rgba(0, 212, 255, 0.07) 0%, rgba(0, 212, 255, 0.03) 40%, transparent 70%)',
          filter: 'blur(60px)',
          opacity: 0.07,
          top: '-5%',
          left: '-5%',
          willChange: 'transform',
        }}
      />

      {/* Blob 2 — neon-purple, center-right drift, 25s cycle */}
      <div
        className="absolute rounded-full animate-aurora-blob-2"
        style={{
          width: '450px',
          height: '450px',
          background:
            'radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, rgba(139, 92, 246, 0.03) 40%, transparent 70%)',
          filter: 'blur(70px)',
          opacity: 0.06,
          top: '20%',
          right: '-10%',
          willChange: 'transform',
        }}
      />

      {/* Blob 3 — mixed blue-purple, bottom drift, 18s cycle */}
      <div
        className="absolute rounded-full animate-aurora-blob-3"
        style={{
          width: '500px',
          height: '500px',
          background:
            'radial-gradient(circle, rgba(0, 212, 255, 0.05) 0%, rgba(139, 92, 246, 0.04) 30%, transparent 70%)',
          filter: 'blur(80px)',
          opacity: 0.08,
          bottom: '-10%',
          left: '20%',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
