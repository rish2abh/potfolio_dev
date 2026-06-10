'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLog } from '@/contexts/LogContext';
import { useEffects } from '@/contexts/EffectsContext';
import { getLogColor } from '@/lib/layout-utils';
import type { LogEntry } from '@/types/effects';

/**
 * Maps log level to Tailwind text color classes.
 * INFO → blue (#60a5fa), OK → green (#4ade80), AI → yellow (#fbbf24), ACTION → purple (#a78bfa)
 */
function getLevelColorClass(level: LogEntry['level']): string {
  const color = getLogColor(level);
  switch (color) {
    case 'blue':
      return 'text-blue-400';
    case 'green':
      return 'text-green-400';
    case 'yellow':
      return 'text-yellow-400';
    case 'purple':
      return 'text-purple-400';
    default:
      return 'text-gray-400';
  }
}

/**
 * Formats a Date to a HH:MM:SS timestamp string.
 */
function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/** Post-boot log entries emitted on a schedule after boot completes */
const POST_BOOT_ENTRIES: { level: LogEntry['level']; message: string; delay: number }[] = [
  { level: 'OK', message: 'System online. All modules loaded.', delay: 200 },
  { level: 'INFO', message: 'Monitoring active connections...', delay: 1200 },
  { level: 'AI', message: 'AI inference pipeline ready.', delay: 2500 },
];

/** Idle log entries cycled after the initial post-boot sequence */
const IDLE_ENTRIES: { level: LogEntry['level']; message: string }[] = [
  { level: 'INFO', message: 'Heartbeat check — all systems nominal.' },
  { level: 'OK', message: 'Cache refreshed. TTL reset.' },
  { level: 'INFO', message: 'Scanning for new connections...' },
  { level: 'AI', message: 'Model inference latency: 23ms avg.' },
  { level: 'ACTION', message: 'Background job queue processed.' },
  { level: 'OK', message: 'Health check passed. Uptime: 99.97%.' },
  { level: 'INFO', message: 'WebSocket connections stable.' },
  { level: 'AI', message: 'Token budget: 84% remaining.' },
];

/**
 * SystemLogPanel — A floating log panel displaying contextual, timestamped entries
 * based on user interactions. Consumes LogContext and EffectsContext.
 *
 * - Fixed position bottom-right on desktop (300px wide, max 320px tall)
 * - Collapsed on mobile (<768px) by default
 * - Color-coded prefixes: blue/INFO, green/OK, yellow/AI, purple/ACTION
 * - Monospace font, glassmorphism background (black/70 + backdrop-blur-[12px])
 * - Minimize/expand toggle; collapsed shows unread count badge (capped at "9+")
 * - Entries animate in with slide-left + fade; max 8 visible
 * - Panel state persists via sessionStorage
 * - Post-boot timing: first entry +200ms, second +1200ms, third +2500ms, then idle 5-8s
 * - Dynamic import with ssr: false
 */
export default function SystemLogPanel() {
  const { entries, isMinimized, toggleMinimize, unreadCount, addEntry } = useLog();
  const { bootCompleted } = useEffects();
  const [isMobile, setIsMobile] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const postBootFired = useRef(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleIndexRef = useRef(0);

  // Detect mobile viewport and auto-collapse on mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-minimize on mobile if no sessionStorage preference exists
      if (mobile && sessionStorage.getItem('log_minimized') === null) {
        if (!isMinimized) toggleMinimize();
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll to bottom when new entries arrive
  useEffect(() => {
    if (listRef.current && !isMinimized) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [entries, isMinimized]);

  // Start idle log cycle (5-8s random interval)
  const scheduleIdleEntry = useCallback(() => {
    const interval = 5000 + Math.random() * 3000; // 5-8 seconds
    idleTimerRef.current = setTimeout(() => {
      const entry = IDLE_ENTRIES[idleIndexRef.current % IDLE_ENTRIES.length];
      addEntry(entry.level, entry.message);
      idleIndexRef.current += 1;
      scheduleIdleEntry();
    }, interval);
  }, [addEntry]);

  // Post-boot timing: emit log entries after boot completes
  useEffect(() => {
    if (!bootCompleted || postBootFired.current) return;
    postBootFired.current = true;

    const timers: ReturnType<typeof setTimeout>[] = [];

    POST_BOOT_ENTRIES.forEach((entry) => {
      const timer = setTimeout(() => {
        addEntry(entry.level, entry.message);
      }, entry.delay);
      timers.push(timer);
    });

    // After the last post-boot entry, start idle cycle
    const lastDelay = POST_BOOT_ENTRIES[POST_BOOT_ENTRIES.length - 1].delay;
    const idleStartTimer = setTimeout(() => {
      scheduleIdleEntry();
    }, lastDelay + 500);
    timers.push(idleStartTimer);

    return () => {
      timers.forEach(clearTimeout);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [bootCompleted, addEntry, scheduleIdleEntry]);

  // Cleanup idle timer on unmount
  useEffect(() => {
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Collapsed state — show icon with unread badge
  if (isMinimized || (isMobile && isMinimized)) {
    return (
      <motion.button
        onClick={toggleMinimize}
        className="fixed bottom-4 right-4 z-50 flex items-center justify-center
          w-10 h-10 rounded-xl
          backdrop-blur-[12px] bg-black/70 border border-white/15
          text-cyan-400 font-mono text-xs
          hover:bg-white/15 transition-colors"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        aria-label={`System log panel - ${unreadCount} unread entries. Click to expand.`}
        aria-hidden="true"
      >
        {/* Terminal icon */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center
              rounded-full bg-red-500 text-[10px] text-white font-bold px-1"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </motion.button>
    );
  }

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50 w-[300px] max-h-[320px]
        flex flex-col
        rounded-xl overflow-hidden
        backdrop-blur-[12px] bg-black/70 border border-white/15
        font-mono text-xs"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      aria-hidden="true"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <span className="text-cyan-400 text-[11px] tracking-wider uppercase">
          System Log
        </span>
        <button
          onClick={toggleMinimize}
          className="text-gray-400 hover:text-white transition-colors text-sm leading-none px-1"
          aria-label="Minimize system log panel"
        >
          ─
        </button>
      </div>

      {/* Log entries list */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-3 py-2 space-y-1 max-h-[260px]"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              layout
              className="flex gap-2 leading-relaxed"
            >
              <span className="text-gray-500 shrink-0">
                {formatTimestamp(entry.timestamp)}
              </span>
              <span className={`shrink-0 font-semibold ${getLevelColorClass(entry.level)}`}>
                [{entry.level}]
              </span>
              <span className="text-gray-300 break-words">
                {entry.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {entries.length === 0 && (
          <div className="text-gray-500 text-center py-4">
            Awaiting system events...
          </div>
        )}
      </div>
    </motion.div>
  );
}
