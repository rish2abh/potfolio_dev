'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Project } from '@/types';
import { useLog } from '@/contexts/LogContext';
import { useEffects } from '@/contexts/EffectsContext';
import { projectLogs } from '@/data/logMessages';
import { calculateCardTilt } from '@/lib/layout-utils';

interface ProjectCardProps {
  project: Project;
  isFeatured?: boolean;
  metrics?: string[];
  hasArchitecture?: boolean;
  onExploreSystem?: () => void;
  onExplore?: () => void;
}

export default function ProjectCard({
  project,
  isFeatured = false,
  metrics,
  hasArchitecture,
  onExploreSystem,
  onExplore,
}: ProjectCardProps) {
  const { addEntry } = useLog();
  const { mousePosition, reducedMotion } = useEffects();
  const hasLoggedHover = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(true);
  const [tilt, setTilt] = useState({ tiltX: 0, tiltY: 0 });

  // Detect fine pointer
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsFinePointer(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Determine if tilt is enabled
  const tiltEnabled = !reducedMotion && isFinePointer;

  // Calculate tilt based on mouse position when hovered
  useEffect(() => {
    if (!tiltEnabled || !isHovered || !cardRef.current) {
      if (isHovered === false) {
        setTilt({ tiltX: 0, tiltY: 0 });
      }
      return;
    }

    const rect = cardRef.current.getBoundingClientRect();
    const cardRect = {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    };

    const { tiltX, tiltY } = calculateCardTilt(
      mousePosition.x,
      mousePosition.y,
      cardRect,
      5
    );

    setTilt({ tiltX, tiltY });
  }, [mousePosition, isHovered, tiltEnabled]);

  const handleCardMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ tiltX: 0, tiltY: 0 });
  }, []);

  const handleMouseEnter = () => {
    if (hasLoggedHover.current) return;
    hasLoggedHover.current = true;
    const logData = projectLogs[project.id];
    if (logData) {
      addEntry(logData.level, logData.message);
    }
  };

  const handleClick = () => {
    const logData = projectLogs[project.id];
    if (logData) {
      addEntry(logData.level, `[CLICK] ${logData.message}`);
    }
  };

  const handleExplore = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onExplore) {
      onExplore();
    } else if (onExploreSystem) {
      onExploreSystem();
    }
  };

  if (isFeatured) {
    return (
      <div
        style={isFinePointer ? { perspective: '1000px' } : undefined}
        className="md:col-span-2"
        onMouseEnter={handleCardMouseEnter}
        onMouseLeave={handleCardMouseLeave}
        ref={cardRef}
        data-testid="featured-perspective-container"
      >
        <motion.article
          className="
            voiceowl-card
            relative rounded-xl p-8
            min-h-[400px]
            backdrop-blur-sm
            bg-black/30
            border border-white/15
            flex flex-col justify-between
          "
          style={{
            transformStyle: isFinePointer ? 'preserve-3d' : 'flat',
            transition: 'transform 200ms ease-out',
            transform: tiltEnabled ? `rotateX(${tilt.tiltX}deg) rotateY(${tilt.tiltY}deg)` : 'none',
          }}
          whileHover={{
            scale: 1.01,
          }}
          transition={{ duration: 0.2 }}
          onMouseEnter={handleMouseEnter}
          onClick={handleClick}
          data-testid="featured-project-card"
        >
        {/* Hover glow overlay */}
        <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none glow-voiceowl-hover" />

        <div className="relative z-10">
          {/* PRIMARY SYSTEM badge */}
          <span
            className="
              inline-block font-mono text-xs
              px-3 py-1 rounded-full
              bg-[#00d4ff]/10 border border-[#00d4ff]/20
              text-[#00d4ff] tracking-[0.1em] uppercase
            "
            data-testid="primary-system-badge"
          >
            [PRIMARY SYSTEM]
          </span>

          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight mt-3">
            {project.name}
          </h3>

          {/* Metrics row */}
          {metrics && metrics.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4" data-testid="metrics-row">
              {metrics.map((metric) => (
                <span
                  key={metric}
                  className="
                    text-xs px-3 py-1.5
                    bg-[#00d4ff]/10 border border-[#00d4ff]/20
                    rounded text-[#00d4ff]/90
                  "
                >
                  {metric}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <p className="text-gray-300 mt-4 max-w-2xl opacity-80">
            {project.description}
          </p>

          {/* Tech stack */}
          <ul className="flex flex-wrap gap-2 mt-4">
            {project.techStack.map((tech) => (
              <li
                key={tech}
                className="px-2 py-1 text-xs rounded-full bg-neon-blue/10 border border-neon-blue/30 text-neon-blue"
              >
                {tech}
              </li>
            ))}
          </ul>

          {/* Contribution & Impact */}
          <p className="text-sm text-gray-400 mt-4">
            <span className="font-semibold text-gray-200">Contribution:</span>{' '}
            {project.contribution}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            <span className="font-semibold text-gray-200">Impact:</span>{' '}
            {project.impact}
          </p>
        </div>

        {/* Bottom actions area */}
        <div className="relative z-10 flex items-center justify-between mt-6">
          <div className="flex items-center gap-4">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neon-blue hover:text-neon-purple transition-colors duration-200"
            >
              GitHub →
            </a>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neon-purple hover:text-neon-blue transition-colors duration-200"
              >
                Live Demo →
              </a>
            )}
          </div>

          {(hasArchitecture || onExplore) && (
            <button
              onClick={handleExplore}
              className="
                text-sm px-4 py-2 rounded-lg
                border border-[#00d4ff]/40
                bg-[#00d4ff]/10 text-[#00d4ff]
                hover:bg-[#00d4ff]/20 hover:border-[#00d4ff]/60
                transition-all duration-200
                glow-neon-idle
              "
              data-cursor="explore"
              data-testid="explore-system-button"
            >
              Explore System →
            </button>
          )}
        </div>
      </motion.article>
      </div>
    );
  }

  // Standard (non-featured) card
  return (
    <div
      style={isFinePointer ? { perspective: '1000px' } : undefined}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
      ref={cardRef}
      data-testid="standard-perspective-container"
    >
      <motion.article
        className="
          relative rounded-xl p-6
          min-h-[200px]
          backdrop-blur-sm
          bg-black/30
          border border-white/10
        "
        style={{
          transformStyle: isFinePointer ? 'preserve-3d' : 'flat',
          transition: 'transform 200ms ease-out',
          transform: tiltEnabled ? `rotateX(${tilt.tiltX}deg) rotateY(${tilt.tiltY}deg)` : 'none',
        }}
        whileHover={{
          scale: 1.03,
        }}
        transition={{ duration: 0.2 }}
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
        data-testid="standard-project-card"
      >
      <h3 className="text-xl font-bold text-white/85 mb-2">{project.name}</h3>

      <p className="text-gray-300/75 mb-4">{project.description}</p>

      <ul className="flex flex-wrap gap-2 mb-4">
        {project.techStack.map((tech) => (
          <li
            key={tech}
            className="px-2 py-1 text-xs rounded-full bg-neon-blue/10 border border-neon-blue/30 text-neon-blue/75"
          >
            {tech}
          </li>
        ))}
      </ul>

      <p className="text-sm text-gray-400/75 mb-2">
        <span className="font-semibold text-gray-200/75">Contribution:</span>{' '}
        {project.contribution}
      </p>

      <p className="text-sm text-gray-400/75 mb-4">
        <span className="font-semibold text-gray-200/75">Impact:</span>{' '}
        {project.impact}
      </p>

      <div className="flex items-center gap-4">
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-neon-blue/75 hover:text-neon-purple transition-colors duration-200"
        >
          GitHub →
        </a>

        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-neon-purple/75 hover:text-neon-blue transition-colors duration-200"
          >
            Live Demo →
          </a>
        )}

        {hasArchitecture && onExploreSystem && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExploreSystem();
            }}
            className="text-sm px-3 py-1 rounded-lg border border-neon-blue/40 bg-neon-blue/10 text-neon-blue hover:bg-neon-blue/20 hover:border-neon-blue/60 transition-colors duration-200"
            data-cursor="explore"
          >
            Explore System →
          </button>
        )}
      </div>
    </motion.article>
    </div>
  );
}
