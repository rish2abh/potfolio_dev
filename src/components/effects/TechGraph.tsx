'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { techNodes } from '@/data/techGraph';
import { TechNode } from '@/types/effects';
import { useEffects } from '@/contexts/EffectsContext';

/** Category color mapping */
const categoryColors: Record<TechNode['category'], { bg: string; border: string; text: string }> = {
  Languages: { bg: 'rgba(251, 146, 60, 0.1)', border: 'rgba(251, 146, 60, 0.6)', text: '#fb923c' },
  Frontend: { bg: 'rgba(56, 189, 248, 0.1)', border: 'rgba(56, 189, 248, 0.6)', text: '#38bdf8' },
  Backend: { bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.6)', text: '#8b5cf6' },
  Architecture: { bg: 'rgba(236, 72, 153, 0.1)', border: 'rgba(236, 72, 153, 0.6)', text: '#ec4899' },
  'AI/Systems': { bg: 'rgba(234, 179, 8, 0.1)', border: 'rgba(234, 179, 8, 0.6)', text: '#eab308' },
  Database: { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.6)', text: '#22c55e' },
  Cloud: { bg: 'rgba(0, 212, 255, 0.1)', border: 'rgba(0, 212, 255, 0.6)', text: '#00d4ff' },
  Security: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.6)', text: '#ef4444' },
  Payments: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.6)', text: '#10b981' },
  Tools: { bg: 'rgba(168, 162, 158, 0.1)', border: 'rgba(168, 162, 158, 0.6)', text: '#a8a29e' },
  Concepts: { bg: 'rgba(167, 139, 250, 0.1)', border: 'rgba(167, 139, 250, 0.6)', text: '#a78bfa' },
};

/** Proficiency badge labels */
const proficiencyLabels: Record<TechNode['proficiency'], string> = {
  expert: '★★★ Expert',
  proficient: '★★ Proficient',
  familiar: '★ Familiar',
};

/** Category cluster center positions (percentage-based) for force layout */
const categoryCenters: Record<TechNode['category'], { x: number; y: number }> = {
  Languages: { x: 13, y: 18 },
  Frontend: { x: 37, y: 18 },
  Backend: { x: 63, y: 18 },
  Architecture: { x: 87, y: 18 },
  'AI/Systems': { x: 13, y: 48 },
  Database: { x: 37, y: 48 },
  Cloud: { x: 63, y: 48 },
  Security: { x: 87, y: 48 },
  Payments: { x: 25, y: 78 },
  Tools: { x: 50, y: 78 },
  Concepts: { x: 75, y: 78 },
};

interface NodePosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/**
 * Simple spring-based force layout: nodes are attracted to their category center
 * and repel each other to avoid overlap. Edges act as springs pulling connected nodes closer.
 */
function initializePositions(nodes: TechNode[]): Map<string, NodePosition> {
  const positions = new Map<string, NodePosition>();
  const categoryCounters: Record<string, number> = {};

  nodes.forEach((node) => {
    const center = categoryCenters[node.category];
    const count = categoryCounters[node.category] || 0;
    categoryCounters[node.category] = count + 1;

    // Spread nodes around their category center
    const angle = (count * 2.4) + Math.random() * 0.5; // golden angle spread
    const radius = 5 + count * 2.5;
    const x = center.x + Math.cos(angle) * radius;
    const y = center.y + Math.sin(angle) * radius;

    positions.set(node.id, {
      x: Math.max(10, Math.min(90, x)),
      y: Math.max(10, Math.min(88, y)),
      vx: 0,
      vy: 0,
    });
  });

  return positions;
}

/**
 * Run a lightweight spring physics simulation step.
 * - Category attraction: pulls nodes toward their category center
 * - Node repulsion: pushes overlapping nodes apart
 * - Edge springs: connected nodes attract slightly
 */
function simulateStep(
  nodes: TechNode[],
  positions: Map<string, NodePosition>,
  damping: number = 0.85
): Map<string, NodePosition> {
  const newPositions = new Map<string, NodePosition>();

  nodes.forEach((node) => {
    const pos = positions.get(node.id)!;
    let fx = 0;
    let fy = 0;

    // Attraction to category center
    const center = categoryCenters[node.category];
    const dxCenter = center.x - pos.x;
    const dyCenter = center.y - pos.y;
    fx += dxCenter * 0.02;
    fy += dyCenter * 0.02;

    // Repulsion from other nodes
    nodes.forEach((other) => {
      if (other.id === node.id) return;
      const otherPos = positions.get(other.id)!;
      const dx = pos.x - otherPos.x;
      const dy = pos.y - otherPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 8 && dist > 0) {
        const force = (8 - dist) / dist * 0.5;
        fx += dx * force;
        fy += dy * force;
      }
    });

    // Edge spring: attraction toward connected nodes
    node.connections.forEach((connId) => {
      const connPos = positions.get(connId);
      if (!connPos) return;
      const dx = connPos.x - pos.x;
      const dy = connPos.y - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 20) {
        fx += dx * 0.005;
        fy += dy * 0.005;
      }
    });

    const vx = (pos.vx + fx) * damping;
    const vy = (pos.vy + fy) * damping;
    const x = Math.max(10, Math.min(90, pos.x + vx));
    const y = Math.max(10, Math.min(88, pos.y + vy));

    newPositions.set(node.id, { x, y, vx, vy });
  });

  return newPositions;
}

/** Compute highlight sets: which nodes are highlighted/dimmed given a hovered node */
export function getHighlightSets(
  nodes: TechNode[],
  hoveredId: string | null
): { highlighted: Set<string>; dimmed: Set<string> } {
  if (!hoveredId) {
    return { highlighted: new Set(nodes.map((n) => n.id)), dimmed: new Set() };
  }

  const hoveredNode = nodes.find((n) => n.id === hoveredId);
  if (!hoveredNode) {
    return { highlighted: new Set(nodes.map((n) => n.id)), dimmed: new Set() };
  }

  const highlighted = new Set<string>([hoveredId, ...hoveredNode.connections]);
  const dimmed = new Set<string>(
    nodes.filter((n) => !highlighted.has(n.id)).map((n) => n.id)
  );

  return { highlighted, dimmed };
}

/** Format tooltip content for a tech node */
export function formatTooltipContent(node: TechNode): string {
  const parts = [
    proficiencyLabels[node.proficiency],
    `${node.yearsOfExperience} years experience`,
  ];
  if (node.relatedProjects.length > 0) {
    parts.push(`Projects: ${node.relatedProjects.join(', ')}`);
  }
  return parts.join(' | ');
}

/** Desktop SVG-based graph view */
function DesktopGraph({
  nodes,
  positions,
  hoveredNode,
  setHoveredNode,
  time,
  reducedMotion,
  performanceTier,
}: {
  nodes: TechNode[];
  positions: Map<string, NodePosition>;
  hoveredNode: string | null;
  setHoveredNode: (id: string | null) => void;
  time: number;
  reducedMotion: boolean;
  performanceTier: 'high' | 'medium' | 'low';
}) {
  const { highlighted, dimmed } = useMemo(
    () => getHighlightSets(nodes, hoveredNode),
    [nodes, hoveredNode]
  );

  // Collect all unique edges (avoid duplicates)
  const edges = useMemo(() => {
    const edgeSet = new Set<string>();
    const result: { from: string; to: string }[] = [];
    nodes.forEach((node) => {
      node.connections.forEach((connId) => {
        const key = [node.id, connId].sort().join('-');
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          result.push({ from: node.id, to: connId });
        }
      });
    });
    return result;
  }, [nodes]);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-full"
      role="img"
      aria-label="Interactive technology skills graph"
    >
      {/* Render edges */}
      {edges.map((edge) => {
        const fromPos = positions.get(edge.from);
        const toPos = positions.get(edge.to);
        if (!fromPos || !toPos) return null;

        const isHighlighted =
          hoveredNode !== null &&
          (highlighted.has(edge.from) && highlighted.has(edge.to));
        const isDimmed = hoveredNode !== null && !isHighlighted;

        return (
          <line
            key={`${edge.from}-${edge.to}`}
            x1={`${fromPos.x}%`}
            y1={`${fromPos.y}%`}
            x2={`${toPos.x}%`}
            y2={`${toPos.y}%`}
            stroke={
              isHighlighted
                ? 'rgba(0, 212, 255, 0.5)'
                : isDimmed
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(255, 255, 255, 0.15)'
            }
            strokeWidth="0.3"
            vectorEffect="non-scaling-stroke"
            style={{ transition: 'stroke 0.3s ease, opacity 0.3s ease' }}
          />
        );
      })}

      {/* Render nodes */}
      {nodes.map((node, idx) => {
        const pos = positions.get(node.id);
        if (!pos) return null;

        const isDimmedNode = dimmed.has(node.id);
        const colors = categoryColors[node.category];

        // Sine oscillation for idle animation (0.2-0.3 viewBox units)
        // Disabled on low performance tier or reduced motion (Req 7.5)
        const oscillationDisabled = reducedMotion || performanceTier === 'low';
        const oscillationX = oscillationDisabled
          ? 0
          : Math.sin(time * 0.002 + idx * 1.3) * 0.3;
        const oscillationY = oscillationDisabled
          ? 0
          : Math.cos(time * 0.0015 + idx * 0.9) * 0.2;

        const displayX = pos.x + oscillationX;
        const displayY = pos.y + oscillationY;

        // Size based on proficiency
        const sizeMap: Record<TechNode['proficiency'], number> = {
          expert: 2.4,
          proficient: 2.0,
          familiar: 1.6,
        };
        const r = sizeMap[node.proficiency];

        return (
          <g
            key={node.id}
            style={{
              opacity: isDimmedNode ? 0.3 : 1,
              transition: 'opacity 0.3s ease',
            }}
          >
            {/* Glow ring on hover */}
            {hoveredNode === node.id && (
              <circle
                cx={`${displayX}%`}
                cy={`${displayY}%`}
                r={r + 1}
                fill="none"
                stroke={colors.border}
                strokeWidth="0.2"
                opacity="0.5"
              />
            )}
            {/* Node circle */}
            <circle
              cx={`${displayX}%`}
              cy={`${displayY}%`}
              r={r}
              fill={colors.bg}
              stroke={colors.border}
              strokeWidth={hoveredNode === node.id ? '0.4' : '0.2'}
              style={{ cursor: 'pointer', transition: 'stroke-width 0.2s ease' }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              role="button"
              tabIndex={0}
              aria-label={`${node.name} - ${node.category}`}
              onFocus={() => setHoveredNode(node.id)}
              onBlur={() => setHoveredNode(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setHoveredNode(hoveredNode === node.id ? null : node.id);
                }
              }}
            />
            {/* Node label */}
            <text
              x={`${displayX}%`}
              y={`${displayY + r + 1.2}%`}
              textAnchor="middle"
              className="text-[1.6px] fill-gray-300 pointer-events-none select-none"
              style={{
                fontSize: '1.6px',
                opacity: isDimmedNode ? 0.3 : 0.9,
                transition: 'opacity 0.3s ease',
              }}
            >
              {node.name}
            </text>
          </g>
        );
      })}

      {/* Category labels */}
      {Object.entries(categoryCenters).map(([category, center]) => {
        const colors = categoryColors[category as TechNode['category']];
        return (
          <text
            key={category}
            x={`${center.x}%`}
            y={`${center.y - 8}%`}
            textAnchor="middle"
            style={{ fontSize: '2px', fill: colors.text, opacity: 0.6 }}
            className="pointer-events-none select-none font-semibold"
          >
            {category}
          </text>
        );
      })}
    </svg>
  );
}

/** Tooltip component displayed on hover */
function NodeTooltip({
  node,
  positions,
  containerRef,
}: {
  node: TechNode;
  positions: Map<string, NodePosition>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const pos = positions.get(node.id);
  if (!pos || !containerRef.current) return null;

  const colors = categoryColors[node.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute z-50 pointer-events-none"
      style={{
        left: `${Math.min(pos.x, 75)}%`,
        top: `${Math.max(pos.y - 18, 2)}%`,
      }}
    >
      <div
        className="rounded-lg p-3 backdrop-blur-md border border-white/20 min-w-[180px]"
        style={{ backgroundColor: 'rgba(10, 10, 15, 0.95)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: colors.border }}
          />
          <span className="text-sm font-semibold text-white">{node.name}</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-400">Proficiency:</span>
            <span
              className="text-[10px] font-medium"
              style={{ color: colors.text }}
            >
              {proficiencyLabels[node.proficiency]}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-400">Experience:</span>
            <span className="text-[10px] text-white">
              {node.yearsOfExperience} {node.yearsOfExperience === 1 ? 'year' : 'years'}
            </span>
          </div>
          {node.relatedProjects.length > 0 && (
            <div>
              <span className="text-[10px] text-gray-400">Projects:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {node.relatedProjects.map((project) => (
                  <span
                    key={project}
                    className="px-1.5 py-0.5 text-[9px] rounded-full border"
                    style={{
                      borderColor: colors.border,
                      color: colors.text,
                      backgroundColor: colors.bg,
                    }}
                  >
                    {project}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/** Mobile grouped vertical layout with expandable categories */
function MobileGraph({ nodes }: { nodes: TechNode[] }) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const groups: Record<string, TechNode[]> = {};
    nodes.forEach((node) => {
      if (!groups[node.category]) groups[node.category] = [];
      groups[node.category].push(node);
    });
    return groups;
  }, [nodes]);

  return (
    <div className="space-y-3">
      {Object.entries(grouped).map(([category, categoryNodes]) => {
        const colors = categoryColors[category as TechNode['category']];
        const isExpanded = expandedCategory === category;

        return (
          <div
            key={category}
            className="rounded-lg border border-white/10 overflow-hidden"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
          >
            <button
              onClick={() =>
                setExpandedCategory(isExpanded ? null : category)
              }
              aria-expanded={isExpanded}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-neon-blue outline-none"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors.border }}
                />
                <span className="text-sm font-semibold text-white">
                  {category}
                </span>
                <span className="text-xs text-gray-400">
                  ({categoryNodes.length})
                </span>
              </div>
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <polyline points="6 9 12 15 18 9" />
              </motion.svg>
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 grid grid-cols-2 gap-2">
                    {categoryNodes.map((node) => (
                      <div
                        key={node.id}
                        className="rounded-lg p-3 border"
                        style={{
                          backgroundColor: colors.bg,
                          borderColor: colors.border,
                        }}
                      >
                        <p
                          className="text-xs font-semibold mb-1"
                          style={{ color: colors.text }}
                        >
                          {node.name}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {proficiencyLabels[node.proficiency]}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {node.yearsOfExperience}yr
                          {node.relatedProjects.length > 0 &&
                            ` · ${node.relatedProjects.length} project${node.relatedProjects.length > 1 ? 's' : ''}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/** Main TechGraph component */
export default function TechGraph() {
  const { reducedMotion, effectsEnabled, performanceTier } = useEffects();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [time, setTime] = useState(0);
  const [positions, setPositions] = useState<Map<string, NodePosition>>(() =>
    initializePositions(techNodes)
  );
  const rafRef = useRef<number>(0);
  const simulationStepsRef = useRef(0);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Run spring physics simulation on mount (settles after ~60 steps)
  useEffect(() => {
    if (isMobile) return;

    const maxSteps = 60;
    let step = 0;
    let currentPositions = positions;

    const simulate = () => {
      if (step >= maxSteps) return;
      currentPositions = simulateStep(techNodes, currentPositions);
      step++;
      setPositions(new Map(currentPositions));
      simulationStepsRef.current = step;
      requestAnimationFrame(simulate);
    };

    simulate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  // Idle oscillation animation loop (disabled on low tier or reduced motion)
  useEffect(() => {
    if (reducedMotion || isMobile || !effectsEnabled || performanceTier === 'low') return;

    let running = true;
    const animate = () => {
      if (!running) return;
      setTime(Date.now());
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion, isMobile, effectsEnabled, performanceTier]);

  // Pause animation when tab is hidden
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const hoveredNodeData = useMemo(
    () => techNodes.find((n) => n.id === hoveredNode) || null,
    [hoveredNode]
  );

  if (!effectsEnabled) {
    // Fallback: simple grid layout
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {techNodes.map((node) => {
          const colors = categoryColors[node.category];
          return (
            <div
              key={node.id}
              className="rounded-lg p-3 border"
              style={{ backgroundColor: colors.bg, borderColor: colors.border }}
            >
              <p className="text-xs font-semibold" style={{ color: colors.text }}>
                {node.name}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">
                {proficiencyLabels[node.proficiency]}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative w-full" aria-label="Interactive tech skills graph">
      {isMobile ? (
        <MobileGraph nodes={techNodes} />
      ) : (
        <div
          ref={containerRef}
          className="relative w-full aspect-[16/10] lg:aspect-[16/9] rounded-xl border border-white/10 bg-dark-base/50"
        >
          <div className="absolute inset-0 overflow-hidden rounded-xl">
            <DesktopGraph
              nodes={techNodes}
              positions={positions}
              hoveredNode={hoveredNode}
              setHoveredNode={setHoveredNode}
              time={time}
              reducedMotion={reducedMotion}
              performanceTier={performanceTier}
            />
          </div>

          {/* Tooltip overlay — outside overflow-hidden so it's not clipped */}
          <AnimatePresence>
            {hoveredNodeData && (
              <NodeTooltip
                key={hoveredNodeData.id}
                node={hoveredNodeData}
                positions={positions}
                containerRef={containerRef}
              />
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Legend for desktop */}
      {!isMobile && (
        <div className="flex flex-wrap justify-center gap-4 mt-4" aria-label="Category legend">
          {Object.entries(categoryColors).map(([category, colors]) => (
            <div key={category} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: colors.border }}
              />
              <span className="text-xs text-gray-400">{category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
