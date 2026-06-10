'use client';

import { useState, useEffect, useRef } from 'react';
import { bootMessages } from '@/data/bootMessages';
import {
  typewriter,
  characterScramble,
  calculateBootSchedule,
  getBootScheduleTotalDuration,
} from '@/lib/effects-utils';
import { useEffects } from '@/contexts/EffectsContext';

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const { reducedMotion } = useEffects();
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [nameText, setNameText] = useState<string | null>(null);
  const [showCursor, setShowCursor] = useState(true);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  // Skip if already completed this session
  useEffect(() => {
    try {
      if (sessionStorage.getItem('boot_completed') === 'true') {
        setVisible(false);
        onComplete();
        return;
      }
    } catch {
      // sessionStorage unavailable — continue with boot
    }
  }, [onComplete]);

  // Skip immediately if reduced motion is preferred
  useEffect(() => {
    if (reducedMotion) {
      setVisible(false);
      onComplete();
    }
  }, [reducedMotion, onComplete]);

  // Blinking cursor effect
  useEffect(() => {
    if (!visible || fading) return;
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, [visible, fading]);

  // Main boot animation using requestAnimationFrame
  useEffect(() => {
    if (!visible || reducedMotion) return;

    // Check session storage again to prevent double-animation
    try {
      if (sessionStorage.getItem('boot_completed') === 'true') {
        setVisible(false);
        onComplete();
        return;
      }
    } catch {
      // continue
    }

    const messageTexts = bootMessages.map((m) => m.text);
    const schedule = calculateBootSchedule(messageTexts);
    const totalDuration = getBootScheduleTotalDuration(schedule);

    // Character scramble config for name reveal
    const SCRAMBLE_DURATION = 400; // ms for name scramble effect
    const NAME = 'Rishabh Shrivastava';

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;

      // Update typed lines based on schedule
      const newLines: string[] = [];
      for (const entry of schedule) {
        if (elapsed >= entry.delay) {
          const messageElapsed = elapsed - entry.delay;
          // Calculate rate from duration: chars = duration * rate / 1000
          // So rate = chars * 1000 / duration
          const rate = (entry.text.length * 1000) / entry.duration;
          const typedText = typewriter(entry.text, messageElapsed, rate);
          newLines.push(typedText);
        }
      }
      setLines(newLines);

      // Check if boot animation is complete
      if (elapsed >= totalDuration && !completedRef.current) {
        completedRef.current = true;

        // Start name scramble effect
        const scrambleStart = performance.now();
        const scrambleAnimate = (ts: number) => {
          const scrambleElapsed = ts - scrambleStart;
          const progress = Math.min(scrambleElapsed / SCRAMBLE_DURATION, 1);
          const scrambled = characterScramble(NAME, progress);
          setNameText(scrambled);

          if (progress < 1) {
            requestAnimationFrame(scrambleAnimate);
          } else {
            setNameText(NAME);
            // Start fade-out
            setTimeout(() => {
              setFading(true);
              // After fade transition completes, remove overlay
              setTimeout(() => {
                setVisible(false);
                onComplete();
              }, 500);
            }, 200);
          }
        };
        requestAnimationFrame(scrambleAnimate);
        return; // Stop boot animation loop
      }

      if (!completedRef.current) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [visible, reducedMotion, onComplete]);

  // Don't render if not visible or reduced motion
  if (!visible || reducedMotion) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-dark-base transition-opacity duration-500 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <div className="max-w-2xl w-full px-6">
        {/* Terminal window */}
        <div className="font-mono text-sm md:text-base text-neon-blue space-y-1">
          {lines.map((line, index) => (
            <div key={index} className="leading-relaxed">
              <span>{line}</span>
              {/* Show cursor on the last line if still typing */}
              {index === lines.length - 1 && !completedRef.current && (
                <span
                  className={`inline-block w-2 h-4 ml-0.5 bg-neon-blue align-middle ${
                    showCursor ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}
            </div>
          ))}

          {/* Name reveal with character scramble */}
          {nameText !== null && (
            <div className="mt-4 text-xl md:text-2xl font-bold text-white">
              {nameText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
