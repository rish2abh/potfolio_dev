'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { LogEntry } from '@/types/effects';

interface LogContextValue {
  entries: LogEntry[];
  addEntry: (level: LogEntry['level'], message: string) => void;
  isMinimized: boolean;
  toggleMinimize: () => void;
  unreadCount: number;
}

const LogContext = createContext<LogContextValue>({
  entries: [],
  addEntry: () => {},
  isMinimized: false,
  toggleMinimize: () => {},
  unreadCount: 0,
});

export function useLog() {
  return useContext(LogContext);
}

const MAX_ENTRIES = 8;

export function LogProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [isMinimized, setIsMinimized] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('log_minimized') === 'true';
  });
  const [unreadCount, setUnreadCount] = useState(0);

  const addEntry = useCallback(
    (level: LogEntry['level'], message: string) => {
      const entry: LogEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date(),
        level,
        message,
      };

      setEntries((prev) => {
        const next = [...prev, entry];
        if (next.length > MAX_ENTRIES) {
          return next.slice(next.length - MAX_ENTRIES);
        }
        return next;
      });

      // Increment unread if minimized
      setUnreadCount((prev) => (isMinimized ? prev + 1 : 0));
    },
    [isMinimized]
  );

  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => {
      const next = !prev;
      sessionStorage.setItem('log_minimized', String(next));
      if (!next) setUnreadCount(0); // Clear unread on expand
      return next;
    });
  }, []);

  return (
    <LogContext.Provider
      value={{ entries, addEntry, isMinimized, toggleMinimize, unreadCount }}
    >
      {children}
    </LogContext.Provider>
  );
}
