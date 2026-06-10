'use client';

import { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';
import About from '@/components/About';
import FocalGlowManager from '@/components/effects/FocalGlowManager';
import { useEffects } from '@/contexts/EffectsContext';
import { useLog } from '@/contexts/LogContext';
import { sectionLogs } from '@/data/logMessages';

// Dynamic imports with ssr: false for client-only effects
const AuroraBackground = dynamic(
  () => import('@/components/effects/AuroraBackground'),
  { ssr: false }
);
const NoiseTexture = dynamic(
  () => import('@/components/effects/NoiseTexture'),
  { ssr: false }
);
const ParticleSystem = dynamic(
  () => import('@/components/effects/ParticleSystem'),
  { ssr: false }
);
const SystemStatusIndicator = dynamic(
  () => import('@/components/effects/SystemStatusIndicator'),
  { ssr: false }
);
const SystemLogPanel = dynamic(
  () => import('@/components/effects/SystemLogPanel'),
  { ssr: false }
);
const BootSequence = dynamic(
  () => import('@/components/effects/BootSequence'),
  { ssr: false }
);
const ContextCursor = dynamic(
  () => import('@/components/effects/ContextCursor'),
  { ssr: false }
);

// Content sections (SSR-safe, code-split)
const Skills = dynamic(() => import('@/components/Skills'));
const Projects = dynamic(() => import('@/components/Projects'));
const Experience = dynamic(() => import('@/components/Experience'));
const Certifications = dynamic(() => import('@/components/Certifications'));
const Contact = dynamic(() => import('@/components/Contact'));

export default function Home() {
  const { bootCompleted, reducedMotion, setBootCompleted } = useEffects();
  const { addEntry } = useLog();

  // Track whether boot was already completed on mount (returning session)
  const bootWasSkipped = useRef(false);
  const heroLogFired = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const wasAlreadyDone =
        sessionStorage.getItem('boot_completed') === 'true';
      bootWasSkipped.current = wasAlreadyDone;
    }
  }, []);

  // Fire hero section log entry when boot completes (hero is always visible first)
  useEffect(() => {
    if (bootCompleted && !heroLogFired.current) {
      heroLogFired.current = true;
      const heroLog = sectionLogs.hero;
      if (heroLog) {
        // Slight delay so it doesn't collide with post-boot entries
        const timer = setTimeout(() => {
          addEntry(heroLog.level, heroLog.message);
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [bootCompleted, addEntry]);

  // Determine if label should show immediately (no animation)
  const skipAnimation = reducedMotion || bootWasSkipped.current;

  return (
    <>
      {/* Layer 0 — Aurora Background: fixed behind everything */}
      <AuroraBackground />

      {/* Layer 1 — Noise Texture: fixed grain overlay */}
      <NoiseTexture />

      {/* Layer 1 — Particle System: fixed, z-1 */}
      <ParticleSystem />

      {/* Boot sequence overlay — z-70, renders on top of everything during boot */}
      <BootSequence onComplete={setBootCompleted} />

      {/* Context-aware custom cursor */}
      <ContextCursor />

      {/* Layer 40 — Dashboard Shell Label: fixed top-center */}
      {bootCompleted && (
        <div
          className={`fixed top-3 left-1/2 -translate-x-1/2 z-40 font-mono text-[11px] uppercase tracking-[0.1em] text-white/60 pointer-events-none ${
            skipAnimation ? '' : 'animate-fadeIn'
          }`}
          style={
            skipAnimation
              ? undefined
              : { animationDelay: '300ms', opacity: 0 }
          }
          aria-hidden="true"
        >
          SYSTEM DASHBOARD
        </div>
      )}

      {/* Layer 40 — System Status Indicator: fixed top-right */}
      <SystemStatusIndicator />

      {/* Layer 50 — System Log Panel: fixed bottom-right */}
      <SystemLogPanel />

      {/* Main content — wrapped in FocalGlowManager for scroll-driven focal dimming */}
      <FocalGlowManager>
        <div className="relative z-10">
          <section data-section="hero" id="hero" aria-label="Hero">
            <div
              className={`transition-opacity duration-500 ${
                bootCompleted ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Hero />
            </div>
          </section>
          <section data-section="about" id="about" aria-label="About">
            <About />
          </section>
          <section data-section="skills" id="skills" aria-label="Skills">
            <Skills />
          </section>
          <section data-section="projects" id="projects" aria-label="Projects">
            <Projects />
          </section>
          <section data-section="experience" id="experience" aria-label="Experience">
            <Experience />
          </section>
          <section data-section="certifications" id="certifications" aria-label="Certifications">
            <Certifications />
          </section>
          <section data-section="contact" id="contact" aria-label="Contact">
            <Contact />
          </section>
        </div>
      </FocalGlowManager>
    </>
  );
}
