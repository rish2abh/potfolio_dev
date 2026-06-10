'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/types';
import { ProjectArchitecture, ArchNode } from '@/types/effects';
import { fluctuateLatency } from '@/lib/layout-utils';
import { useEffects } from '@/contexts/EffectsContext';
import { useLog } from '@/contexts/LogContext';
import { voiceowlOverviewData } from '@/data/voiceowlExploreData';
import { voiceowlArchitecture } from '@/data/architectures';

// ─── Tab Types & Configuration ─────────────────────────────────────────────────

export type TabId = 'overview' | 'architecture' | 'features' | 'contributions';

export interface TabConfig {
  id: TabId;
  label: string;
  icon: string;
}

export const TABS: TabConfig[] = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'architecture', label: 'Architecture', icon: '🏗️' },
  { id: 'features', label: 'Features', icon: '⚡' },
  { id: 'contributions', label: 'Contributions', icon: '🚀' },
];

// ─── TabBar Sub-Component ──────────────────────────────────────────────────────

export interface TabBarProps {
  tabs: TabConfig[];
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const tabCount = tabs.length;
    let newIndex: number | null = null;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        newIndex = (index + 1) % tabCount;
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = (index - 1 + tabCount) % tabCount;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = tabCount - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onTabChange(tabs[index].id);
        return;
      default:
        return;
    }

    if (newIndex !== null) {
      tabRefs.current[newIndex]?.focus();
      onTabChange(tabs[newIndex].id);
    }
  };

  return (
    <div
      role="tablist"
      aria-label="VoiceOwl project details"
      className="sticky top-0 z-10 flex gap-1 p-1 bg-white/5 rounded-lg border border-white/10 overflow-x-auto scrollbar-hide"
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            ref={(el) => { tabRefs.current[index] = el; }}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#00d4ff] ${
              isActive
                ? 'bg-white/10 text-white border-b-2 border-[#00d4ff]'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            <span aria-hidden="true">{tab.icon}</span>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Stub Panel Components (lazy-rendered, only active panel is mounted) ───────

export interface OverviewPanelProps {
  isActive: boolean;
  heavyAnimationsEnabled: boolean;
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

function OverviewPanel({ isActive, heavyAnimationsEnabled }: OverviewPanelProps) {
  const { description, problems, impactStats, systemSummary } = voiceowlOverviewData;

  // Animated counters — when heavyAnimationsEnabled is false, show final values instantly
  const shouldAnimate = isActive && heavyAnimationsEnabled;
  const dailyActiveUsers = useAnimatedCounter(impactStats[0].value, 2000, shouldAnimate);
  const dailyApiRequests = useAnimatedCounter(impactStats[1].value, 2000, shouldAnimate);
  const uptime = useAnimatedCounter(impactStats[2].value, 2000, shouldAnimate);

  const counterValues = [dailyActiveUsers, dailyApiRequests, uptime];

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Description */}
      <motion.div
        className="text-white/80 text-sm md:text-base leading-relaxed"
        variants={itemVariants}
      >
        <p>{description}</p>
      </motion.div>

      {/* Core Problems 2×2 Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={containerVariants}
      >
        {problems.map((problem) => (
          <motion.div
            key={problem.title}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
            variants={itemVariants}
          >
            <h4 className="text-white font-semibold text-sm mb-2">{problem.title}</h4>
            <p className="text-white/60 text-xs leading-relaxed">{problem.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* System Summary */}
      <motion.div
        className="text-white/70 text-sm leading-relaxed"
        variants={itemVariants}
      >
        <p>{systemSummary}</p>
      </motion.div>

      {/* Impact Stats - 3 Animated Counter Blocks */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={containerVariants}
      >
        {impactStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="p-5 bg-white/5 border border-white/10 rounded-xl text-center"
            variants={itemVariants}
          >
            <p className="text-2xl md:text-3xl font-bold text-white tabular-nums">
              {heavyAnimationsEnabled ? counterValues[index] : stat.value}
              <span className="text-lg text-white/60">{stat.suffix}</span>
            </p>
            <p className="text-white/60 text-xs mt-2 uppercase tracking-wider font-mono">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export interface ArchitecturePanelProps {
  architecture: ProjectArchitecture;
  heavyAnimationsEnabled: boolean;
}

// Color map for node types
const NODE_COLOR_MAP: Record<ArchNode['type'], string> = {
  user: '#3b82f6',
  backend: '#22c55e',
  ai: '#a855f7',
  database: '#f59e0b',
  external: '#6b7280',
};

function ArchitecturePanel({ architecture, heavyAnimationsEnabled }: ArchitecturePanelProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const { nodes, edges } = architecture;

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId((prev) => (prev === nodeId ? null : nodeId));
  };

  const handleNodeMouseEnter = (nodeId: string, event: React.MouseEvent) => {
    setHoveredNodeId(nodeId);
    // Calculate tooltip position relative to the SVG container
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setTooltipPos({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top - 10,
      });
    }
  };

  const handleNodeMouseLeave = () => {
    setHoveredNodeId(null);
    setTooltipPos(null);
  };

  const selectedNode = selectedNodeId
    ? nodes.find((n) => n.id === selectedNodeId) ?? null
    : null;

  const hoveredNode = hoveredNodeId
    ? nodes.find((n) => n.id === hoveredNodeId) ?? null
    : null;

  // Node dimensions in viewBox units
  const nodeWidth = 16;
  const nodeHeight = 10;

  return (
    <div className="space-y-4">
      {/* SVG Node Graph */}
      <div className="relative bg-white/5 border border-white/10 rounded-xl p-4 overflow-x-auto">
        <svg
          ref={svgRef}
          viewBox="0 0 100 80"
          width="100%"
          height="auto"
          className="min-w-[500px]"
          role="img"
          aria-label="System architecture node graph"
        >
          {/* SVG Filters for glow effects */}
          <defs>
            {Object.entries(NODE_COLOR_MAP).map(([type, color]) => (
              <filter key={type} id={`glow-${type}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feFlood floodColor={color} floodOpacity="0.4" result="color" />
                <feComposite in="color" in2="blur" operator="in" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}
            {/* Enhanced glow for hovered node */}
            {Object.entries(NODE_COLOR_MAP).map(([type, color]) => (
              <filter key={`${type}-hover`} id={`glow-${type}-hover`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feFlood floodColor={color} floodOpacity="0.7" result="color" />
                <feComposite in="color" in2="blur" operator="in" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}
          </defs>

          {/* Render Edges */}
          {edges.map((edge) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const x1 = fromNode.position.x + nodeWidth / 2;
            const y1 = fromNode.position.y + nodeHeight / 2;
            const x2 = toNode.position.x + nodeWidth / 2;
            const y2 = toNode.position.y + nodeHeight / 2;
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            return (
              <g key={`${edge.from}-${edge.to}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="0.3"
                  strokeLinecap="round"
                />
                {edge.label && (
                  <text
                    x={midX}
                    y={midY - 1.2}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.4)"
                    fontSize="2"
                    fontFamily="monospace"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Render Nodes */}
          {nodes.map((node) => {
            const color = NODE_COLOR_MAP[node.type];
            const isHovered = hoveredNodeId === node.id;
            const isSelected = selectedNodeId === node.id;
            const filter = isHovered
              ? `url(#glow-${node.type}-hover)`
              : `url(#glow-${node.type})`;
            const scale = isHovered && heavyAnimationsEnabled ? 1.05 : 1;
            const cx = node.position.x + nodeWidth / 2;
            const cy = node.position.y + nodeHeight / 2;

            return (
              <g
                key={node.id}
                transform={`translate(${node.position.x}, ${node.position.y})`}
                style={{
                  transformOrigin: `${cx}px ${cy}px`,
                  transform: `scale(${scale})`,
                  transition: heavyAnimationsEnabled ? 'transform 0.2s ease' : 'none',
                  cursor: 'pointer',
                }}
                filter={filter}
                onMouseEnter={(e) => handleNodeMouseEnter(node.id, e)}
                onMouseLeave={handleNodeMouseLeave}
                onClick={() => handleNodeClick(node.id)}
                role="button"
                aria-label={`${node.label} node - ${node.role}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNodeClick(node.id);
                  }
                }}
              >
                {/* Node rect */}
                <rect
                  x={0}
                  y={0}
                  width={nodeWidth}
                  height={nodeHeight}
                  rx={1.5}
                  ry={1.5}
                  fill="rgba(15, 23, 42, 0.9)"
                  stroke={color}
                  strokeWidth={isSelected ? 0.6 : 0.4}
                  opacity={isHovered ? 1 : 0.9}
                />
                {/* Node label */}
                <text
                  x={nodeWidth / 2}
                  y={3.8}
                  textAnchor="middle"
                  fill="white"
                  fontSize="2.2"
                  fontWeight="600"
                  fontFamily="system-ui, sans-serif"
                >
                  {node.label}
                </text>
                {/* Technology pills */}
                {node.technologies.slice(0, 2).map((tech, i) => (
                  <text
                    key={tech}
                    x={nodeWidth / 2}
                    y={6.2 + i * 2}
                    textAnchor="middle"
                    fill={color}
                    fontSize="1.6"
                    fontFamily="monospace"
                    opacity={0.8}
                  >
                    {tech}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>

        {/* Tooltip (HTML positioned over SVG) */}
        {hoveredNode && tooltipPos && (
          <div
            className="absolute pointer-events-none bg-gray-900/95 border border-white/20 rounded-lg px-3 py-2 text-xs text-white/90 max-w-[200px] z-20 shadow-lg"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <p className="font-semibold">{hoveredNode.label}</p>
            <p className="text-white/60 mt-0.5">{hoveredNode.role}</p>
          </div>
        )}
      </div>

      {/* Selected Node Info Card */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            key={selectedNode.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div
              className="p-5 bg-white/5 border rounded-xl"
              style={{ borderColor: `${NODE_COLOR_MAP[selectedNode.type]}40` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: NODE_COLOR_MAP[selectedNode.type] }}
                />
                <h4 className="text-white font-semibold text-sm">{selectedNode.label}</h4>
                <span className="text-xs text-white/40 font-mono uppercase">{selectedNode.type}</span>
              </div>
              <p className="text-white/70 text-sm mb-3">{selectedNode.role}</p>
              <div className="flex flex-wrap gap-2">
                {selectedNode.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-xs font-medium rounded-full border"
                    style={{
                      borderColor: `${NODE_COLOR_MAP[selectedNode.type]}30`,
                      color: NODE_COLOR_MAP[selectedNode.type],
                      backgroundColor: `${NODE_COLOR_MAP[selectedNode.type]}10`,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FeaturesPanel() {
  return (
    <div className="min-h-[200px] p-4 bg-white/5 border border-white/10 rounded-xl">
      <p className="text-white/60 text-sm font-mono">Features panel — content coming soon</p>
    </div>
  );
}

function ContributionsPanel() {
  return (
    <div className="min-h-[200px] p-4 bg-white/5 border border-white/10 rounded-xl">
      <p className="text-white/60 text-sm font-mono">Contributions panel — content coming soon</p>
    </div>
  );
}

// ─── Loading Shimmer Sub-Component ─────────────────────────────────────────────

/** Subtle loading shimmer line shown during micro-delay on tab change */
export function LoadingShimmer() {
  return (
    <div className="w-full h-0.5 overflow-hidden rounded-full">
      <div className="h-full w-full bg-gradient-to-r from-transparent via-[#00d4ff]/40 to-transparent animate-pulse" />
    </div>
  );
}

// ─── Tab Change Handler Hook ───────────────────────────────────────────────────

/**
 * Hook that manages system log integration and micro-delay realism on tab change.
 * - Logs tab change to system log via LogContext
 * - Manages `contentReady` state with a ~150ms artificial delay
 * - Returns `contentReady` boolean and a `handleTabChange` callback
 */
export function useTabChangeHandler(tabs: TabConfig[]) {
  const { addEntry } = useLog();
  const [contentReady, setContentReady] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTabChange = useCallback(
    (tabId: TabId) => {
      const tab = tabs.find((t) => t.id === tabId);
      const tabLabel = tab?.label ?? tabId;

      // Log the tab change to system log
      addEntry('AI', `[AI] Switching to ${tabLabel} view...`);

      // Start micro-delay: content not ready
      setContentReady(false);

      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // After 150ms delay, mark content as ready
      timerRef.current = setTimeout(() => {
        setContentReady(true);
        timerRef.current = null;
      }, 150);
    },
    [addEntry, tabs]
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { contentReady, handleTabChange };
}

// ─── ProjectSystemView Types ───────────────────────────────────────────────────

export interface ProjectSystemViewProps {
  project: Project;
  onClose: () => void;
}

/** Animated counter that counts from 0 to target over duration ms */
function useAnimatedCounter(target: number, duration: number, active: boolean): number {
  const [value, setValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }

    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [target, duration, active]);

  return value;
}

/** Architecture flow node */
function FlowNode({ label, isFirst, isLast }: { label: string; isFirst?: boolean; isLast?: boolean }) {
  return (
    <div className="flex items-center">
      {!isFirst && (
        <div className="flex items-center mx-2 md:mx-4">
          <div className="w-6 md:w-10 h-px bg-[#00d4ff]/40" />
          <svg width="8" height="12" viewBox="0 0 8 12" className="text-[#00d4ff]/60">
            <path d="M1 1 L7 6 L1 11" stroke="currentColor" fill="none" strokeWidth="1.5" />
          </svg>
        </div>
      )}
      <div className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg font-mono text-xs md:text-sm text-white/90 whitespace-nowrap">
        {label}
      </div>
    </div>
  );
}

/** Main ProjectSystemView Component */
export default function ProjectSystemView({
  project,
  onClose,
}: ProjectSystemViewProps) {
  const { setOverlayActive, performanceTier, reducedMotion, effectsEnabled } = useEffects();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(true);

  // Tab state management
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const { contentReady, handleTabChange } = useTabChangeHandler(TABS);

  // Combined tab change handler: updates state + fires log/delay
  const onTabChange = useCallback(
    (tabId: TabId) => {
      setActiveTab(tabId);
      handleTabChange(tabId);
    },
    [handleTabChange]
  );

  // VoiceOwl-only tab activation
  const isVoiceOwl = project.id === 'voiceowl-ai';

  // Performance-aware animation control
  const heavyAnimationsEnabled = performanceTier === 'high' && effectsEnabled && !reducedMotion;

  // Live metrics state
  const apiRequests = useAnimatedCounter(2847391, 2000, isOpen);
  const [latency, setLatency] = useState(42);

  // Set overlay active to pause lower-tier animations
  useEffect(() => {
    setOverlayActive(true);
    return () => {
      setOverlayActive(false);
    };
  }, [setOverlayActive]);

  // Fluctuate latency every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.round(fluctuateLatency(42)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${project.name} system dashboard`}
          className="fixed inset-0 z-[60] bg-[#020617]/95 backdrop-blur-xl overflow-y-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Header Bar */}
          <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 md:px-8">
            <div className="flex items-center gap-3">
              {/* Blinking green status dot */}
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-green-400">
                System Active
              </span>
              <span className="hidden md:inline-block text-white/30 mx-2">|</span>
              <span className="hidden md:inline-block text-white font-semibold text-sm">
                {project.name}
              </span>
            </div>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Close system view"
              className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-colors focus-visible:ring-2 focus-visible:ring-[#00d4ff] outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </header>

          {/* Live Metrics Panel */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8" aria-label="Live metrics">
            {/* API Requests */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-xs font-mono uppercase tracking-wider text-white/50 mb-2">
                API Requests
              </p>
              <p className="text-2xl md:text-3xl font-bold text-white tabular-nums">
                {formatNumber(apiRequests)}
              </p>
              <p className="text-xs text-white/40 mt-1">Total processed</p>
            </div>

            {/* Avg Latency */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-xs font-mono uppercase tracking-wider text-white/50 mb-2">
                Avg Latency
              </p>
              <p className="text-2xl md:text-3xl font-bold text-white tabular-nums">
                {latency}<span className="text-lg text-white/60">ms</span>
              </p>
              <p className="text-xs text-white/40 mt-1">Response time</p>
            </div>

            {/* Uptime */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-xs font-mono uppercase tracking-wider text-white/50 mb-2">
                Uptime
              </p>
              <p className="text-2xl md:text-3xl font-bold text-white">
                99.97<span className="text-lg text-white/60">%</span>
              </p>
              <p className="text-xs text-white/40 mt-1">Last 30 days</p>
            </div>
          </section>

          {isVoiceOwl ? (
            /* VoiceOwl: TabBar + lazy-loaded tab panels */
            <section className="p-6 md:p-8 space-y-4" aria-label="VoiceOwl project details">
              <TabBar tabs={TABS} activeTab={activeTab} onTabChange={onTabChange} />

              {/* Tab panel area */}
              {!contentReady && <LoadingShimmer />}
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  role="tabpanel"
                  id={`panel-${activeTab}`}
                  aria-labelledby={`tab-${activeTab}`}
                  tabIndex={0}
                >
                  {contentReady && (
                    (() => {
                      switch (activeTab) {
                        case 'overview':
                          return <OverviewPanel isActive={activeTab === 'overview'} heavyAnimationsEnabled={heavyAnimationsEnabled} />;
                        case 'architecture':
                          return <ArchitecturePanel architecture={voiceowlArchitecture} heavyAnimationsEnabled={heavyAnimationsEnabled} />;
                        case 'features':
                          return <FeaturesPanel />;
                        case 'contributions':
                          return <ContributionsPanel />;
                      }
                    })()
                  )}
                </motion.div>
              </AnimatePresence>
            </section>
          ) : (
            /* Non-VoiceOwl: existing architecture + tech/links layout */
            <>
              {/* Architecture Diagram */}
              <section className="p-6 md:p-8" aria-label="System architecture">
                <h3 className="text-sm font-mono uppercase tracking-wider text-white/50 mb-4">
                  System Architecture
                </h3>
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl overflow-x-auto">
                  <div className="flex items-center justify-center min-w-[400px]">
                    <FlowNode label="Input" isFirst />
                    <FlowNode label="AI Router" />
                    <FlowNode label="Voice Engine" />
                    <FlowNode label="Output" isLast />
                  </div>
                </div>
              </section>

              {/* Tech Stack + Action Links */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8" aria-label="Technology and links">
                {/* Tech Stack Pills */}
                <div>
                  <h3 className="text-sm font-mono uppercase tracking-wider text-white/50 mb-4">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 text-xs font-medium rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/20 text-[#00d4ff]/90"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Links */}
                <div>
                  <h3 className="text-sm font-mono uppercase tracking-wider text-white/50 mb-4">
                    Links
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-white/80 hover:text-white hover:border-white/30 transition-colors"
                    >
                      GitHub
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </a>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#00d4ff]/30 bg-[#00d4ff]/10 text-sm text-[#00d4ff] hover:bg-[#00d4ff]/20 transition-colors"
                      >
                        Live Demo
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </section>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
