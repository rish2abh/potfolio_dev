'use client';

import { motion } from 'framer-motion';
import { Experience } from '@/types';

interface TimelineEntryProps {
  experience: Experience;
}

export default function TimelineEntry({ experience }: TimelineEntryProps) {
  return (
    <div className="relative flex gap-6 pb-10 last:pb-0">
      {/* Visual connector: vertical line + dot node */}
      <div className="flex flex-col items-center">
        <div
          className="
            w-4 h-4 rounded-full
            bg-neon-blue
            border-2 border-neon-purple
            flex-shrink-0
            z-10
          "
        />
        <div
          className="
            w-0.5 flex-1
            bg-gradient-to-b from-neon-blue/50 to-neon-purple/30
          "
        />
      </div>

      {/* Content card */}
      <motion.div
        className="
          flex-1 rounded-xl p-6
          backdrop-blur-[12px]
          bg-white/10
          border border-white/15
        "
        whileHover={{
          scale: 1.02,
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Header: company, role, dates */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-white">{experience.company}</h3>
          <p className="text-neon-blue font-medium">{experience.role}</p>
          <p className="text-sm text-white/60 mt-1">
            {experience.startDate} – {experience.endDate}
          </p>
        </div>

        {/* Description */}
        <p className="text-white/80 mb-4">{experience.description}</p>

        {/* Contributions list */}
        <ul className="space-y-2 mb-4">
          {experience.contributions.map((contribution, index) => (
            <li key={index} className="flex items-start gap-2 text-white/70 text-sm">
              <span className="text-neon-purple mt-0.5">▹</span>
              <span>{contribution}</span>
            </li>
          ))}
        </ul>

        {/* Measurable impact */}
        <div className="pt-3 border-t border-white/10">
          <p className="text-sm">
            <span className="text-neon-purple font-medium">Impact: </span>
            <span className="text-white/80">{experience.impact}</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
