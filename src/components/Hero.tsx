'use client';

import { motion } from 'framer-motion';
import { personalInfo } from '@/data/personal';
import Button from '@/components/ui/Button';
import MagneticWrapper from '@/components/effects/MagneticWrapper';
import SystemVisualization from '@/components/effects/SystemVisualization';
import { useEffects } from '@/contexts/EffectsContext';

export default function Hero() {
  const { performanceTier, mousePosition, reducedMotion } = useEffects();

  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center px-6"
    >
      <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-8 lg:gap-12">
        {/* Left Column: Identity Content */}
        <motion.div
          className="flex-1 text-center md:text-left order-2 md:order-1 w-full md:w-1/2 lg:w-[55%]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-[-0.03em] text-white mb-2 leading-[1.1]">
            Rishabh Shrivastava
          </h1>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-[-0.02em] text-white/80 mb-4 leading-[1.2]">
            I architect backends that{' '}
            <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              don&apos;t break at scale.
            </span>
          </h3>
          <p className="text-lg md:text-xl text-white/60 max-w-lg mb-6 mx-auto md:mx-0">
            3+ years building real-time AI systems, high-throughput APIs, and infrastructure that handles millions of requests without flinching.
          </p>

          {/* Impact highlights */}
          <ul className="space-y-2 mb-8 text-sm md:text-base text-white/75 max-w-lg mx-auto md:mx-0">
            <li className="flex items-start gap-2">
              <span className="text-neon-blue mt-0.5">▸</span>
              Engineered a voice AI platform serving 150K+ daily users with sub-200ms latency
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neon-blue mt-0.5">▸</span>
              Built real-time SSE dashboards handling 2M+ daily API requests at 99.9% uptime
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neon-blue mt-0.5">▸</span>
              Decomposed monoliths into microservices — cutting deploy time from 15 min to 90s
            </li>
          </ul>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-8">
            <MagneticWrapper>
              <Button variant="primary" href="#projects" className="glow-neon-idle">
                View Projects
              </Button>
            </MagneticWrapper>
            <MagneticWrapper>
              <Button variant="secondary" href="#contact" className="glow-neon-idle">
                Contact Me
              </Button>
            </MagneticWrapper>
            <MagneticWrapper>
              <Button variant="outline" href={personalInfo.resumePath} className="glow-neon-idle">
                Download Resume
              </Button>
            </MagneticWrapper>
          </div>

          {/* Social Links */}
          <div className="flex gap-6 justify-center md:justify-start">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-neon-blue transition-colors duration-200"
              aria-label="GitHub Profile"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-neon-blue transition-colors duration-200"
              aria-label="LinkedIn Profile"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </motion.div>

        {/* Right Column: System Visualization */}
        <motion.div
          className="order-1 md:order-2 flex-shrink-0 flex items-center justify-center w-full md:w-1/2 lg:w-[45%]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.4 }}
        >
          <SystemVisualization
            performanceTier={performanceTier}
            mousePosition={mousePosition}
            reducedMotion={reducedMotion}
          />
        </motion.div>
      </div>
    </section>
  );
}
