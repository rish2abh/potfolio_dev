'use client';

import { experience } from '@/data/experience';
import SectionWrapper from './SectionWrapper';
import TimelineEntry from './ui/TimelineEntry';

export default function Experience() {
  return (
    <SectionWrapper sectionId="experience">
      <section id="experience" className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
          Execution Timeline
        </h2>

        <div className="relative">
          {experience.map((entry) => (
            <TimelineEntry key={entry.id} experience={entry} />
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
}
