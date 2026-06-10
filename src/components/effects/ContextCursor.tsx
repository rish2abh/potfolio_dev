'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useEffects } from '@/contexts/EffectsContext';
import { resolveCursorState } from '@/lib/layout-utils';

/**
 * ContextCursor — A custom cursor with inner dot (8px) and outer ring (32px)
 * that follows the mouse with a spring delay of 80-120ms.
 *
 * Features:
 * - Only renders on @media (pointer: fine) devices
 * - Disabled when reduced-motion is active
 * - Shows contextual labels: "Explore" on [data-cursor="explore"], "Open" on [data-cursor="open"]
 * - Scales 1.5x on buttons
 * - Uses pointer-events: none to not interfere with clicks
 * - Uses resolveCursorState utility for state mapping
 * - Cursor trail: 8-position ring buffer, updated every 50ms, opacity decay from 10% to 60%
 *
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.7, 6.8, 11.2, 11.3, 10.4
 */

interface TrailPosition {
  x: number;
  y: number;
}

const TRAIL_LENGTH = 8;
const TRAIL_UPDATE_INTERVAL = 50; // ms
const TRAIL_DOT_RADIUS = 3; // px
const TRAIL_OPACITY_MIN = 0.10;
const TRAIL_OPACITY_MAX = 0.60;

export default function ContextCursor() {
  const { reducedMotion, performanceTier } = useEffects();
  const [hasFinePointer, setHasFinePointer] = useState(false);
  const [visible, setVisible] = useState(false);

  // Cursor positions — dot follows mouse exactly, ring follows with spring delay
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  // Current cursor state
  const [label, setLabel] = useState<string | null>(null);
  const [scale, setScale] = useState(1.0);

  // Position tracking refs (avoid re-renders for every mouse move)
  const mousePos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  // Trail ring buffer (8 positions)
  const trailBuffer = useRef<TrailPosition[]>([]);
  const trailIndex = useRef(0); // write pointer for ring buffer
  const trailIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const trailDotsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Determine if trail should be active
  const trailActive = hasFinePointer && !reducedMotion && performanceTier !== 'low';

  // Detect pointer: fine media query
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia('(pointer: fine)');
    setHasFinePointer(mq.matches);

    const handler = (e: MediaQueryListEvent) => {
      setHasFinePointer(e.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Determine element type from data attributes or tag
  const getElementType = useCallback((target: EventTarget | null): string => {
    if (!target || !(target instanceof HTMLElement)) return 'other';

    // Walk up the DOM to find the closest element with a data-cursor attribute or relevant tag
    let el: HTMLElement | null = target;
    while (el) {
      // Check data-cursor attribute
      const cursorAttr = el.getAttribute('data-cursor');
      if (cursorAttr === 'explore') return 'project-card';
      if (cursorAttr === 'open') return 'external-link';

      // Check if element is a button
      if (
        el.tagName === 'BUTTON' ||
        el.getAttribute('role') === 'button' ||
        (el.tagName === 'A' && el.classList.contains('btn'))
      ) {
        return 'button';
      }

      el = el.parentElement;
    }

    return 'other';
  }, []);

  // Mouse move handler
  useEffect(() => {
    if (!hasFinePointer || reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      setVisible(true);

      // Determine cursor state from hovered element
      const elementType = getElementType(e.target);
      const cursorState = resolveCursorState(elementType);
      setLabel(cursorState.label);
      setScale(cursorState.scale);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasFinePointer, reducedMotion, getElementType]);

  // Animation loop — spring-based follow with 80-120ms delay for ring
  useEffect(() => {
    if (!hasFinePointer || reducedMotion) return;

    // Spring factor: higher = more responsive. ~0.12 gives 80-120ms feel
    const SPRING_FACTOR = 0.12;

    const animate = () => {
      // Dot follows mouse instantly
      dotPos.current.x = mousePos.current.x;
      dotPos.current.y = mousePos.current.y;

      // Ring follows with spring delay
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * SPRING_FACTOR;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * SPRING_FACTOR;

      // Apply transforms directly to DOM elements (no re-render)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotPos.current.x - 4}px, ${dotPos.current.y - 4}px)`;
      }
      if (ringRef.current) {
        const ringSize = 32 * scale;
        const offset = ringSize / 2;
        ringRef.current.style.transform = `translate(${ringPos.current.x - offset}px, ${ringPos.current.y - offset}px) scale(${scale})`;
      }

      // Update trail dot positions from buffer
      if (trailActive && trailBuffer.current.length > 0) {
        const bufLen = trailBuffer.current.length;
        for (let i = 0; i < TRAIL_LENGTH; i++) {
          const dotEl = trailDotsRef.current[i];
          if (!dotEl) continue;

          // Read from ring buffer in order: oldest first
          // The write pointer (trailIndex) points to the NEXT write slot,
          // so the oldest entry is at trailIndex (wrapping around)
          const bufferIdx = (trailIndex.current + i) % bufLen;
          const pos = trailBuffer.current[bufferIdx];

          if (pos) {
            // Linear opacity decay: index 0 = oldest (10%), index 7 = newest (60%)
            const opacity = TRAIL_OPACITY_MIN + (i / (TRAIL_LENGTH - 1)) * (TRAIL_OPACITY_MAX - TRAIL_OPACITY_MIN);
            dotEl.style.transform = `translate(${pos.x - TRAIL_DOT_RADIUS}px, ${pos.y - TRAIL_DOT_RADIUS}px)`;
            dotEl.style.opacity = visible ? String(opacity) : '0';
          } else {
            dotEl.style.opacity = '0';
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [hasFinePointer, reducedMotion, scale, trailActive, visible]);

  // Trail ring buffer update — throttled to every 50ms
  useEffect(() => {
    if (!trailActive) {
      // Clear trail buffer when disabled
      trailBuffer.current = [];
      trailIndex.current = 0;
      return;
    }

    // Initialize buffer with empty positions
    if (trailBuffer.current.length === 0) {
      trailBuffer.current = Array.from({ length: TRAIL_LENGTH }, () => ({ x: 0, y: 0 }));
    }

    trailIntervalRef.current = setInterval(() => {
      // Write current mouse position into ring buffer at write pointer
      trailBuffer.current[trailIndex.current] = {
        x: mousePos.current.x,
        y: mousePos.current.y,
      };
      // Advance write pointer (wraps around)
      trailIndex.current = (trailIndex.current + 1) % TRAIL_LENGTH;
    }, TRAIL_UPDATE_INTERVAL);

    return () => {
      if (trailIntervalRef.current !== null) {
        clearInterval(trailIntervalRef.current);
        trailIntervalRef.current = null;
      }
    };
  }, [trailActive]);

  // Don't render on touch devices or when reduced motion is active
  if (!hasFinePointer || reducedMotion) {
    return null;
  }

  return (
    <>
      {/* Trail dots — 8 positions with opacity decay, only when trail is active */}
      {trailActive && Array.from({ length: TRAIL_LENGTH }, (_, i) => (
        <div
          key={`trail-${i}`}
          ref={(el) => { trailDotsRef.current[i] = el; }}
          className="fixed top-0 left-0 z-[9998] pointer-events-none"
          style={{
            width: `${TRAIL_DOT_RADIUS * 2}px`,
            height: `${TRAIL_DOT_RADIUS * 2}px`,
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            mixBlendMode: 'screen',
            opacity: 0,
            willChange: 'transform, opacity',
          }}
          aria-hidden="true"
        />
      ))}

      {/* Inner dot — 8px, follows cursor exactly */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#00d4ff',
          opacity: visible ? 1 : 0,
          transition: 'opacity 150ms ease',
          willChange: 'transform',
        }}
        aria-hidden="true"
      />

      {/* Outer ring — 32px, follows with spring delay */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '2px solid #00d4ff',
          opacity: visible ? 0.8 : 0,
          transition: 'opacity 150ms ease',
          willChange: 'transform',
          transformOrigin: 'center center',
        }}
        aria-hidden="true"
      >
        {/* Label displayed adjacent to cursor ring */}
        {label && (
          <span
            ref={labelRef}
            className="absolute left-full ml-2 top-1/2 -translate-y-1/2 text-xs font-mono whitespace-nowrap"
            style={{
              color: '#00d4ff',
              textShadow: '0 0 4px rgba(0, 212, 255, 0.5)',
            }}
          >
            {label}
          </span>
        )}
      </div>
    </>
  );
}
