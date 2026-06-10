'use client';

import { useEffect, useRef, useCallback, useState, type ReactNode } from 'react';
import { useEffects } from '@/contexts/EffectsContext';
import { calculateFocalSection, type SectionRect } from '@/lib/layout-utils';

interface FocalGlowManagerProps {
  children: ReactNode;
}

const OBSERVER_THRESHOLDS = [0, 0.25, 0.3, 0.5, 0.75, 1.0];
const DEBOUNCE_MS = 80;

/**
 * FocalGlowManager wraps the main content and manages which section
 * is visually "focal" at any given scroll position.
 *
 * It uses a single IntersectionObserver with merged thresholds to track
 * all [data-section] elements, determines which section's center is
 * closest to the viewport center, and applies `data-focal="true"` to
 * that section. Non-focal sections are dimmed via CSS rules in globals.css.
 *
 * The wrapper exposes `data-focal-container` and `data-perf` attributes.
 */
export default function FocalGlowManager({ children }: FocalGlowManagerProps) {
  const { performanceTier } = useEffects();
  const containerRef = useRef<HTMLDivElement>(null);
  const [focalSectionId, setFocalSectionId] = useState<string | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRectsRef = useRef<Map<string, DOMRectReadOnly>>(new Map());

  const updateFocalSection = useCallback(() => {
    const sections: SectionRect[] = [];
    sectionRectsRef.current.forEach((rect, id) => {
      sections.push({
        id,
        rect: { top: rect.top, bottom: rect.bottom, height: rect.height },
      });
    });

    const viewportHeight = window.innerHeight;
    const newFocalId = calculateFocalSection(sections, viewportHeight);

    setFocalSectionId((prev) => {
      if (prev !== newFocalId) {
        return newFocalId;
      }
      return prev;
    });
  }, []);

  const debouncedUpdateFocal = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      updateFocalSection();
    }, DEBOUNCE_MS);
  }, [updateFocalSection]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          const sectionId = target.dataset.section;
          if (!sectionId) return;

          if (entry.isIntersecting) {
            sectionRectsRef.current.set(sectionId, entry.boundingClientRect);
          } else {
            sectionRectsRef.current.delete(sectionId);
          }
        });

        debouncedUpdateFocal();
      },
      { threshold: OBSERVER_THRESHOLDS }
    );

    // Observe all [data-section] elements within the container
    const sectionElements = container.querySelectorAll('[data-section]');
    sectionElements.forEach((el) => observer.observe(el));

    // Also observe dynamically added sections via MutationObserver
    const mutationObserver = new MutationObserver(() => {
      const newSections = container.querySelectorAll('[data-section]');
      newSections.forEach((el) => observer.observe(el));
    });
    mutationObserver.observe(container, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [debouncedUpdateFocal]);

  // Apply data-focal attribute to the active section
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sectionElements = container.querySelectorAll('[data-section]');
    sectionElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      const sectionId = htmlEl.dataset.section;
      if (sectionId === focalSectionId) {
        htmlEl.setAttribute('data-focal', 'true');
      } else {
        htmlEl.removeAttribute('data-focal');
      }
    });
  }, [focalSectionId]);

  return (
    <div
      ref={containerRef}
      data-focal-container=""
      data-perf={performanceTier}
    >
      {children}
    </div>
  );
}
