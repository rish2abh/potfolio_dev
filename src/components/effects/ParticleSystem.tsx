'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useEffects } from '@/contexts/EffectsContext';
import { calculateRepulsion, shouldDrawLine } from '@/lib/physics-utils';
import { calculateParallaxOffset } from '@/lib/layout-utils';

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  opacity: number;
  depth: number; // 0-2 depth layer (affects speed and size)
}

const BASE_PARTICLE_COUNT = 60;
const REDUCED_PARTICLE_COUNT = 30;
const COLORS = ['#00d4ff', '#8b5cf6', '#06b6d4'];
const LINE_THRESHOLD = 120;
const REPULSION_RADIUS = 150;

function createParticle(width: number, height: number): Particle {
  const depth = Math.floor(Math.random() * 3); // 0 = far, 1 = mid, 2 = near
  const depthFactor = 0.5 + depth * 0.3; // 0.5, 0.8, 1.1

  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: (Math.random() * 1.5 + 0.5) * depthFactor,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    vx: (Math.random() - 0.5) * 0.4 * depthFactor,
    vy: (Math.random() - 0.5) * 0.3 * depthFactor,
    opacity: (Math.random() * 0.2 + 0.1) * depthFactor,
    depth,
  };
}

export default function ParticleSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const isVisibleRef = useRef(true);
  const linesEnabledRef = useRef(true);
  const particleCountRef = useRef(BASE_PARTICLE_COUNT);
  const fpsFramesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef(performance.now());

  const { reducedMotion, effectsEnabled, mousePosition, performanceTier, overlayActive } =
    useEffects();

  // Performance-based adjustments: 60 particles on high/medium, 30 on low
  // Lines enabled on high/medium, disabled on low
  useEffect(() => {
    if (performanceTier === 'low') {
      particleCountRef.current = REDUCED_PARTICLE_COUNT;
      linesEnabledRef.current = false;
    } else {
      particleCountRef.current = BASE_PARTICLE_COUNT;
      linesEnabledRef.current = true;
    }
  }, [performanceTier]);

  // Visibility change handler — pause rAF when tab is hidden, reset timing on resume
  useEffect(() => {
    const handleVisibility = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
      if (isVisibleRef.current) {
        // Reset frame timing when becoming visible to avoid large delta spike
        lastFrameTimeRef.current = performance.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Local FPS monitor for adaptive complexity reduction
  const checkPerformance = useCallback(() => {
    const now = performance.now();
    const delta = now - lastFrameTimeRef.current;
    lastFrameTimeRef.current = now;

    if (delta > 0) {
      const fps = 1000 / delta;
      fpsFramesRef.current.push(fps);

      // Keep rolling window of 30 frames
      if (fpsFramesRef.current.length > 30) {
        fpsFramesRef.current.shift();
      }

      // Check average over 30 frames
      if (fpsFramesRef.current.length === 30) {
        const avgFps =
          fpsFramesRef.current.reduce((a, b) => a + b, 0) / fpsFramesRef.current.length;

        if (avgFps < 30) {
          // Reduce complexity progressively
          if (linesEnabledRef.current) {
            linesEnabledRef.current = false;
          } else if (particleCountRef.current > REDUCED_PARTICLE_COUNT) {
            particleCountRef.current = REDUCED_PARTICLE_COUNT;
          }
        }
      }
    }
  }, []);

  // Main canvas animation effect
  useEffect(() => {
    // Effects disabled — don't render anything
    if (!effectsEnabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function initParticles() {
      if (!canvas) return;
      particlesRef.current = Array.from({ length: particleCountRef.current }, () =>
        createParticle(canvas.width, canvas.height)
      );
    }

    resizeCanvas();
    initParticles();

    // Reduced motion: render static dots once and stop
    if (reducedMotion) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const particle of particlesRef.current) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        ctx.closePath();
      }
      ctx.globalAlpha = 1;
      return;
    }

    function animate() {
      if (!ctx || !canvas) return;

      // Pause rAF loop when tab is hidden or overlay (ProjectSystemView) is active
      if (!isVisibleRef.current || overlayActive) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      checkPerformance();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mouse = mousePosition;

      // Calculate cursor parallax offset (max 15px) based on cursor distance from viewport center
      const parallax = calculateParallaxOffset(
        mouse.x,
        mouse.y,
        canvas.width,
        canvas.height
      );

      // Update particle positions and apply repulsion
      for (const particle of particles) {
        // Apply mouse repulsion
        const repulsion = calculateRepulsion(
          { x: particle.x, y: particle.y },
          { x: mouse.x, y: mouse.y },
          REPULSION_RADIUS
        );

        particle.vx += repulsion.x * 0.5;
        particle.vy += repulsion.y * 0.5;

        // Dampen velocity
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        // Maintain minimum velocity for continuous drift
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        const depthFactor = 0.5 + particle.depth * 0.3;
        const minSpeed = 0.1 * depthFactor;
        if (speed < minSpeed) {
          const angle = Math.atan2(particle.vy, particle.vx) || Math.random() * Math.PI * 2;
          particle.vx = Math.cos(angle) * minSpeed;
          particle.vy = Math.sin(angle) * minSpeed;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      }

      // Draw connecting lines (high/medium only, within 120px threshold)
      if (linesEnabledRef.current) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];

            if (shouldDrawLine({ x: p1.x, y: p1.y }, { x: p2.x, y: p2.y }, LINE_THRESHOLD)) {
              const dx = p1.x - p2.x;
              const dy = p1.y - p2.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const lineOpacity = (1 - distance / LINE_THRESHOLD) * 0.15;

              // Apply parallax offset to rendered line positions
              const p1x = p1.x + parallax.x;
              const p1y = p1.y + parallax.y;
              const p2x = p2.x + parallax.x;
              const p2y = p2.y + parallax.y;

              ctx.beginPath();
              ctx.moveTo(p1x, p1y);
              ctx.lineTo(p2x, p2y);
              ctx.strokeStyle = '#00d4ff';
              ctx.globalAlpha = lineOpacity;
              ctx.lineWidth = 0.5;
              ctx.stroke();
              ctx.closePath();
            }
          }
        }
      }

      // Draw particles with parallax offset applied
      for (const particle of particles) {
        const renderX = particle.x + parallax.x;
        const renderY = particle.y + parallax.y;

        ctx.beginPath();
        ctx.arc(renderX, renderY, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        ctx.closePath();
      }

      ctx.globalAlpha = 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [reducedMotion, effectsEnabled, mousePosition, checkPerformance, overlayActive]);

  // Return null when effects are disabled (render nothing)
  if (!effectsEnabled) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  );
}
