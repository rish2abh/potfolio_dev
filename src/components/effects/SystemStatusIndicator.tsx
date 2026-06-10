'use client';

import { useState, useEffect } from 'react';
import { useEffects } from '@/contexts/EffectsContext';
import { fluctuateLatency } from '@/lib/layout-utils';

/**
 * SystemStatusIndicator — Persistent HUD element fixed to top-right corner.
 * Displays system status metrics: connection status, latency, and active module count.
 * Reinforces the "live AI system dashboard" narrative.
 *
 * Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5, 10.6
 */
export default function SystemStatusIndicator() {
  const { bootCompleted, moduleCount } = useEffects();
  const [visible, setVisible] = useState(false);
  const [latency, setLatency] = useState(() => Math.floor(Math.random() * 8) + 28); // 28-35ms

  // Fade in after boot completes
  useEffect(() => {
    if (bootCompleted) {
      // Small delay to let other boot animations settle
      const timer = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [bootCompleted]);

  // Latency fluctuation every 2-4 seconds
  useEffect(() => {
    if (!bootCompleted) return;

    const scheduleUpdate = () => {
      const interval = 2000 + Math.random() * 2000; // 2-4s
      return setTimeout(() => {
        setLatency((prev) => Math.round(fluctuateLatency(prev)));
        timerId = scheduleUpdate();
      }, interval);
    };

    let timerId = scheduleUpdate();
    return () => clearTimeout(timerId);
  }, [bootCompleted]);

  // Don't render anything during boot
  if (!bootCompleted) return null;

  return (
    <div
      className="fixed top-4 right-6 z-40 flex items-center gap-4 font-mono uppercase tracking-[0.05em] text-white/70"
      style={{
        fontSize: '11px',
        opacity: visible ? 0.7 : 0,
        transition: 'opacity 400ms ease-in-out',
      }}
      aria-label="System status indicator"
      role="status"
    >
      {/* Status dot + ONLINE */}
      <span className="flex items-center gap-2">
        <span
          className="inline-block h-2 w-2 rounded-full bg-green-400 animate-statusPulse"
          aria-hidden="true"
        />
        <span>Online</span>
      </span>

      {/* Latency — hidden on mobile */}
      <span className="hidden md:block tabular-nums">
        Latency: {latency}ms
      </span>

      {/* Module count — hidden on mobile */}
      <span className="hidden md:block">
        Modules: {moduleCount} Active
      </span>
    </div>
  );
}
