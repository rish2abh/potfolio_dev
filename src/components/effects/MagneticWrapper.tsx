'use client';

import { useRef, useState, useEffect, type ReactNode } from 'react';
import { calculateMagneticTranslation } from '@/lib/physics-utils';
import { useEffects } from '@/contexts/EffectsContext';

interface MagneticWrapperProps {
  children: ReactNode;
  strength?: number; // max px translation, default 8
  radius?: number; // proximity in px, default 60
  disabled?: boolean;
  className?: string;
}

/**
 * Wraps an element to apply a magnetic pull effect toward the cursor
 * when within a defined proximity radius.
 *
 * Reads mousePosition from EffectsContext — NO per-component mousemove listener.
 * Disabled on touch devices and when reduced-motion is active.
 */
export default function MagneticWrapper({
  children,
  strength = 8,
  radius = 60,
  disabled = false,
  className = '',
}: MagneticWrapperProps) {
  const { reducedMotion, mousePosition } = useEffects();
  const ref = useRef<HTMLDivElement>(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isPointerFine, setIsPointerFine] = useState(false);
  const rafRef = useRef<number>(0);

  // Detect pointer type (only enable on fine pointer devices)
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    setIsPointerFine(mq.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsPointerFine(e.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const isActive = isPointerFine && !reducedMotion && !disabled;

  // Reset translate when effect becomes inactive
  useEffect(() => {
    if (!isActive) {
      setTranslate({ x: 0, y: 0 });
    }
  }, [isActive]);

  // React to mousePosition changes from context (no own listener)
  useEffect(() => {
    if (!isActive || !ref.current) return;

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const elemCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      const cursor = { x: mousePosition.x, y: mousePosition.y };
      const translation = calculateMagneticTranslation(
        elemCenter,
        cursor,
        radius,
        strength
      );

      setTranslate(translation);
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, mousePosition, radius, strength]);

  const style = isActive
    ? {
        transform: `translate(${translate.x}px, ${translate.y}px)`,
        transition:
          translate.x === 0 && translate.y === 0
            ? 'transform 300ms ease-out'
            : 'transform 0ms',
      }
    : undefined;

  return (
    <div ref={ref} className={`inline-block ${className}`} style={style}>
      {children}
    </div>
  );
}
