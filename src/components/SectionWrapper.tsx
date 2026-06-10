'use client';

import { useRef, useEffect, useState, Children, useMemo } from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { useLog } from '@/contexts/LogContext';
import { sectionLogs } from '@/data/logMessages';
import { calculateStaggerDelays } from '@/lib/layout-utils';

export type AnimationVariant = 'fade-up' | 'fade-left' | 'fade-right';

interface SectionWrapperProps {
  children: React.ReactNode;
  variant?: AnimationVariant;
  className?: string;
  sectionId?: string;
}

const easeOutQuad = [0.25, 0.46, 0.45, 0.94] as const;

const childVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

export default function SectionWrapper({
  children,
  variant = 'fade-up',
  className = '',
  sectionId,
}: SectionWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isTriggered, setIsTriggered] = useState(false);
  const { addEntry } = useLog();
  const hasFiredRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  const childCount = Children.count(children);

  // Calculate stagger delays: 150ms base, 1200ms max total
  const staggerDelays = useMemo(
    () => calculateStaggerDelays(childCount, 150, 1200),
    [childCount]
  );

  // IntersectionObserver: trigger at 30% visibility, once only
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If reduced motion, render in final state immediately
    if (prefersReducedMotion) {
      setIsTriggered(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasFiredRef.current) {
          hasFiredRef.current = true;
          setIsTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  // Fire log entry on section visibility
  useEffect(() => {
    if (!sectionId || !isTriggered) return;

    const logData = sectionLogs[sectionId];
    if (logData) {
      addEntry(logData.level, logData.message);
    }
  }, [sectionId, isTriggered, addEntry]);

  // For prefers-reduced-motion: render everything in final state immediately
  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      {Children.map(children, (child, index) => {
        // Calculate cumulative delay: 100ms initial + sum of previous stagger delays
        const delay =
          0.1 + staggerDelays.slice(0, index).reduce((sum, d) => sum + d, 0) / 1000;

        return (
          <motion.div
            initial="hidden"
            animate={isTriggered ? 'visible' : 'hidden'}
            variants={childVariants}
            transition={{
              duration: 0.5,
              ease: easeOutQuad as unknown as number[],
              delay,
            }}
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
}
