'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  type ReactNode,
} from 'react';
import { EffectsState } from '@/types/effects';

// ---------------------------------------------------------------------------
// AnimationCoordinator — manages multiple rAF loops centrally.
// When overlayActive is true, registered "background" loops are paused.
// ---------------------------------------------------------------------------

type AnimationCallback = (deltaMs: number) => void;

interface RegisteredLoop {
  callback: AnimationCallback;
  /** If true, this loop pauses when overlayActive is set */
  pauseOnOverlay: boolean;
}

export class AnimationCoordinator {
  private loops = new Map<string, RegisteredLoop>();
  private rafId: number | null = null;
  private lastTime = 0;
  private running = false;
  private _overlayActive = false;

  get overlayActive() {
    return this._overlayActive;
  }

  set overlayActive(active: boolean) {
    this._overlayActive = active;
  }

  /** Register a named animation loop. Returns an unregister function. */
  register(
    id: string,
    callback: AnimationCallback,
    options: { pauseOnOverlay?: boolean } = {}
  ): () => void {
    this.loops.set(id, {
      callback,
      pauseOnOverlay: options.pauseOnOverlay ?? true,
    });

    if (!this.running && this.loops.size > 0) {
      this.start();
    }

    return () => {
      this.loops.delete(id);
      if (this.loops.size === 0) {
        this.stop();
      }
    };
  }

  private start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.tick();
  }

  private stop() {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private tick = () => {
    if (!this.running) return;

    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;

    this.loops.forEach((loop) => {
      // Skip background loops when overlay is active
      if (loop.pauseOnOverlay && this._overlayActive) return;
      loop.callback(delta);
    });

    this.rafId = requestAnimationFrame(this.tick);
  };

  destroy() {
    this.stop();
    this.loops.clear();
  }
}

// ---------------------------------------------------------------------------
// Shared IntersectionObserver — merged thresholds for FocalGlowManager,
// SectionWrapper entrance triggers, and module count tracking.
// ---------------------------------------------------------------------------

type SectionObserverCallback = (
  entries: IntersectionObserverEntry[]
) => void;

export interface SectionObserverHandle {
  observe: (el: Element) => void;
  unobserve: (el: Element) => void;
  subscribe: (cb: SectionObserverCallback) => () => void;
}

const MERGED_THRESHOLDS = [0, 0.25, 0.3, 0.5, 0.75, 1.0];

// ---------------------------------------------------------------------------
// Context types
// ---------------------------------------------------------------------------

interface EffectsContextValue extends EffectsState {
  /** Module count — number of unique sections scrolled to (for HUD) */
  moduleCount: number;
  setQuickViewMode: (enabled: boolean) => void;
  setBootCompleted: () => void;
  setActiveSection: (section: string) => void;
  setOverlayActive: (active: boolean) => void;
  reportPerformanceDrop: () => void;
  disableEffects: () => void;
  /** Shared AnimationCoordinator for all rAF loops */
  animationCoordinator: AnimationCoordinator;
  /** Shared IntersectionObserver handle for sections */
  sectionObserver: SectionObserverHandle | null;
}

const defaultState: EffectsState = {
  reducedMotion: false,
  effectsEnabled: true,
  quickViewMode: false,
  performanceTier: 'high',
  bootCompleted: false,
  mousePosition: { x: 0, y: 0 },
  activeSection: 'hero',
  overlayActive: false,
};

// Singleton coordinator created once per provider instance
const noopCoordinator = new AnimationCoordinator();

const EffectsContext = createContext<EffectsContextValue>({
  ...defaultState,
  moduleCount: 1,
  setQuickViewMode: () => {},
  setBootCompleted: () => {},
  setActiveSection: () => {},
  setOverlayActive: () => {},
  reportPerformanceDrop: () => {},
  disableEffects: () => {},
  animationCoordinator: noopCoordinator,
  sectionObserver: null,
});

export function useEffects() {
  return useContext(EffectsContext);
}

export function EffectsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EffectsState>(() => {
    // Check sessionStorage for persisted state (client-only)
    if (typeof window === 'undefined') return defaultState;

    const quickView = sessionStorage.getItem('quick_view') === 'true';
    const bootDone = sessionStorage.getItem('boot_completed') === 'true';

    return {
      ...defaultState,
      quickViewMode: quickView,
      bootCompleted: bootDone,
    };
  });

  const [moduleCount, setModuleCount] = useState(1);
  const visitedSectionsRef = useRef<Set<string>>(new Set(['hero']));
  const performanceDropCount = useRef(0);

  // AnimationCoordinator — single instance for the provider lifetime
  const coordinatorRef = useRef<AnimationCoordinator | null>(null);
  if (!coordinatorRef.current) {
    coordinatorRef.current = new AnimationCoordinator();
  }
  const coordinator = coordinatorRef.current;

  // Keep coordinator's overlayActive in sync with state
  useEffect(() => {
    coordinator.overlayActive = state.overlayActive;
  }, [state.overlayActive, coordinator]);

  // Shared IntersectionObserver for sections
  const subscribersRef = useRef<Set<SectionObserverCallback>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Notify all subscribers
        subscribersRef.current.forEach((cb) => cb(entries));

        // Internal: track module count based on sections entering viewport
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const sectionId = target.dataset.section;
            if (sectionId && !visitedSectionsRef.current.has(sectionId)) {
              visitedSectionsRef.current.add(sectionId);
              setModuleCount(Math.min(6, visitedSectionsRef.current.size));
            }
          }
        });
      },
      { threshold: MERGED_THRESHOLDS }
    );

    observerRef.current = observer;

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, []);

  const sectionObserver = useMemo<SectionObserverHandle>(
    () => ({
      observe: (el: Element) => {
        observerRef.current?.observe(el);
      },
      unobserve: (el: Element) => {
        observerRef.current?.unobserve(el);
      },
      subscribe: (cb: SectionObserverCallback) => {
        subscribersRef.current.add(cb);
        return () => {
          subscribersRef.current.delete(cb);
        };
      },
    }),
    []
  );

  // Detect reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setState((s) => ({ ...s, reducedMotion: mq.matches }));

    const handler = (e: MediaQueryListEvent) => {
      setState((s) => ({ ...s, reducedMotion: e.matches }));
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Detect device capabilities
  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 4;
    let tier: EffectsState['performanceTier'] = 'high';
    if (cores <= 2) tier = 'low';
    else if (cores <= 4) tier = 'medium';

    setState((s) => ({ ...s, performanceTier: tier }));
  }, []);

  // Track mouse position — single RAF-gated handler (no per-component listeners)
  useEffect(() => {
    let rafId: number;
    const handleMouse = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setState((s) => ({
          ...s,
          mousePosition: { x: e.clientX, y: e.clientY },
        }));
      });
    };

    document.addEventListener('mousemove', handleMouse);
    return () => {
      document.removeEventListener('mousemove', handleMouse);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Pause rAF loop on tab visibility change (requirement 9.1)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        coordinator.overlayActive = true;
      } else {
        // Restore to actual overlay state
        coordinator.overlayActive = state.overlayActive;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [coordinator, state.overlayActive]);

  // Cleanup coordinator on unmount
  useEffect(() => {
    return () => {
      coordinatorRef.current?.destroy();
    };
  }, []);

  const setQuickViewMode = useCallback((enabled: boolean) => {
    sessionStorage.setItem('quick_view', String(enabled));
    setState((s) => ({ ...s, quickViewMode: enabled }));
  }, []);

  const setBootCompleted = useCallback(() => {
    sessionStorage.setItem('boot_completed', 'true');
    setState((s) => ({ ...s, bootCompleted: true }));
  }, []);

  const setActiveSection = useCallback((section: string) => {
    setState((s) => ({ ...s, activeSection: section }));
  }, []);

  const reportPerformanceDrop = useCallback(() => {
    performanceDropCount.current += 1;
    // After 3 sustained drops, downgrade tier
    if (performanceDropCount.current >= 3) {
      setState((s) => {
        if (s.performanceTier === 'high') return { ...s, performanceTier: 'medium' };
        if (s.performanceTier === 'medium') return { ...s, performanceTier: 'low' };
        return { ...s, effectsEnabled: false };
      });
      performanceDropCount.current = 0;
    }
  }, []);

  const disableEffects = useCallback(() => {
    setState((s) => ({ ...s, effectsEnabled: false }));
  }, []);

  const setOverlayActive = useCallback((active: boolean) => {
    setState((s) => ({ ...s, overlayActive: active }));
  }, []);

  return (
    <EffectsContext.Provider
      value={{
        ...state,
        moduleCount,
        setQuickViewMode,
        setBootCompleted,
        setActiveSection,
        setOverlayActive,
        reportPerformanceDrop,
        disableEffects,
        animationCoordinator: coordinator,
        sectionObserver,
      }}
    >
      {children}
    </EffectsContext.Provider>
  );
}
