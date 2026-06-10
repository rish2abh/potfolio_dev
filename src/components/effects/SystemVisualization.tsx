'use client';

import { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface SystemVisualizationProps {
  performanceTier: 'high' | 'medium' | 'low';
  mousePosition: { x: number; y: number };
  reducedMotion: boolean;
}

// Hexagonal node positions (relative to SVG viewBox 0 0 400 400, center at 200,200)
const NODES = [
  { id: 'node-1', cx: 200, cy: 120 }, // top
  { id: 'node-2', cx: 270, cy: 160 }, // top-right
  { id: 'node-3', cx: 270, cy: 240 }, // bottom-right
  { id: 'node-4', cx: 200, cy: 280 }, // bottom
  { id: 'node-5', cx: 130, cy: 240 }, // bottom-left
  { id: 'node-6', cx: 130, cy: 160 }, // top-left
];

// Outer ring connections
const OUTER_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
];

// Cross connections (rendered at 10% opacity)
const CROSS_CONNECTIONS = [
  [0, 3], [1, 4], [2, 5],
];

// Canvas micro-particle config
const MICRO_PARTICLE_COUNT = 18;
const CURSOR_REACT_RADIUS = 80;

interface MicroParticle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
}

function createMicroParticles(count: number): MicroParticle[] {
  return Array.from({ length: count }, () => {
    const x = Math.random() * 400;
    const y = Math.random() * 400;
    return {
      x,
      y,
      baseX: x,
      baseY: y,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1 + 1,
    };
  });
}

export default function SystemVisualization({
  performanceTier,
  mousePosition,
  reducedMotion,
}: SystemVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<MicroParticle[]>(createMicroParticles(MICRO_PARTICLE_COUNT));
  const animationFrameRef = useRef<number>(0);
  const timeRef = useRef(0);

  const isPhase2 = performanceTier !== 'low';
  const isPhase3 = performanceTier === 'high';

  // Canvas micro-particles animation (Layer 5 - high tier only)
  const animateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Calculate cursor position relative to the canvas (0-400 range)
    const relX = ((mousePosition.x - rect.left) / rect.width) * 400;
    const relY = ((mousePosition.y - rect.top) / rect.height) * 400;

    ctx.clearRect(0, 0, 400, 400);
    ctx.globalCompositeOperation = 'screen';

    for (const particle of particlesRef.current) {
      // Cursor repulsion
      const dx = particle.x - relX;
      const dy = particle.y - relY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CURSOR_REACT_RADIUS && dist > 0) {
        const force = (CURSOR_REACT_RADIUS - dist) / CURSOR_REACT_RADIUS;
        particle.vx += (dx / dist) * force * 2;
        particle.vy += (dy / dist) * force * 2;
      }

      // Drift back to base position
      particle.vx += (particle.baseX - particle.x) * 0.005;
      particle.vy += (particle.baseY - particle.y) * 0.005;

      // Dampen
      particle.vx *= 0.95;
      particle.vy *= 0.95;

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around
      if (particle.x < 0) particle.x = 400;
      if (particle.x > 400) particle.x = 0;
      if (particle.y < 0) particle.y = 400;
      if (particle.y > 400) particle.y = 0;

      // Draw
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
    animationFrameRef.current = requestAnimationFrame(animateParticles);
  }, [mousePosition]);

  // Start/stop canvas animation for Phase 3
  useEffect(() => {
    if (!isPhase3 || reducedMotion) {
      cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    animationFrameRef.current = requestAnimationFrame(animateParticles);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [isPhase3, reducedMotion, animateParticles]);

  // Sine wave oscillation for nodes (Layer 3) via SVG animation
  useEffect(() => {
    if (!isPhase2 || reducedMotion) return;

    let running = true;
    const startTime = performance.now();

    function updateNodes() {
      if (!running) return;
      const elapsed = (performance.now() - startTime) / 1000;
      timeRef.current = elapsed;

      // Update node positions via DOM (lightweight)
      NODES.forEach((node, i) => {
        const el = document.getElementById(node.id);
        if (!el) return;
        const phase = (i / NODES.length) * Math.PI * 2;
        const period = 3 + (i % 2) * 0.5; // 3-3.5s period
        const amplitude = 2 + (i % 2); // 2-3px amplitude
        const offsetX = Math.sin((elapsed / period) * Math.PI * 2 + phase) * amplitude;
        const offsetY = Math.cos((elapsed / period) * Math.PI * 2 + phase + 0.5) * amplitude;
        el.setAttribute('cx', String(node.cx + offsetX));
        el.setAttribute('cy', String(node.cy + offsetY));
      });

      requestAnimationFrame(updateNodes);
    }

    requestAnimationFrame(updateNodes);
    return () => { running = false; };
  }, [isPhase2, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] lg:w-[400px] lg:h-[400px]"
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      {/* Layer 1: Background Glow */}
      <div
        className={`absolute inset-0 rounded-full ${
          reducedMotion ? '' : 'animate-pulseGlow'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.6) 0%, transparent 70%)',
          filter: 'blur(60px)',
          opacity: reducedMotion ? 0.3 : undefined,
        }}
      />

      {/* SVG Layers 2-4 */}
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 2 }}
      >
        <defs>
          <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </radialGradient>
        </defs>

        {/* Layer 2: Rotating Ring (medium+ only) */}
        {isPhase2 && (
          <circle
            cx="200"
            cy="200"
            r="140"
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeDasharray="8 12"
            opacity="0.2"
            className={reducedMotion ? '' : 'animate-rotateRing'}
            style={{ transformOrigin: '200px 200px' }}
          />
        )}

        {/* Layer 3: Network Nodes (medium+ only) */}
        {isPhase2 && (
          <g>
            {/* Outer connections */}
            {OUTER_CONNECTIONS.map(([from, to]) => (
              <line
                key={`outer-${from}-${to}`}
                x1={NODES[from].cx}
                y1={NODES[from].cy}
                x2={NODES[to].cx}
                y2={NODES[to].cy}
                stroke="#00d4ff"
                strokeWidth="1"
                opacity="0.15"
              />
            ))}

            {/* Cross connections (10% opacity) */}
            {CROSS_CONNECTIONS.map(([from, to]) => (
              <line
                key={`cross-${from}-${to}`}
                x1={NODES[from].cx}
                y1={NODES[from].cy}
                x2={NODES[to].cx}
                y2={NODES[to].cy}
                stroke="#00d4ff"
                strokeWidth="1"
                opacity="0.1"
              />
            ))}

            {/* Nodes */}
            {NODES.map((node) => (
              <circle
                key={node.id}
                id={node.id}
                cx={node.cx}
                cy={node.cy}
                r="4"
                fill="#00d4ff"
                opacity="0.8"
              />
            ))}
          </g>
        )}

        {/* Layer 4: Pulsing Core (always renders) */}
        <motion.circle
          cx="200"
          cy="200"
          r="30"
          fill="url(#coreGradient)"
          className="glow-viz-core"
          animate={
            reducedMotion
              ? { scale: 1 }
              : { scale: [0.9, 1.1, 0.9] }
          }
          transition={
            reducedMotion
              ? undefined
              : {
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
          style={{ transformOrigin: '200px 200px' }}
        />
      </svg>

      {/* Layer 5: Canvas Micro-Particles (high tier only) */}
      {isPhase3 && !reducedMotion && (
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 4, mixBlendMode: 'screen' }}
        />
      )}
    </div>
  );
}
