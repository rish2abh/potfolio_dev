'use client';

import dynamic from 'next/dynamic';
import { skills } from '@/data/skills';
import { Skill } from '@/types';
import SectionWrapper from './SectionWrapper';
import SkillItem from './ui/SkillItem';

const TechGraph = dynamic(
  () => import('@/components/effects/TechGraph'),
  {
    ssr: false,
    loading: () => <SkillsFallbackGrid />,
  }
);

function groupByCategory(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});
}

/** Fallback grid layout shown while TechGraph loads or if it fails */
function SkillsFallbackGrid() {
  const grouped = groupByCategory(skills);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {Object.entries(grouped).map(([category, categorySkills]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold text-white/80 mb-4">
            {category}
          </h3>
          <div className="flex flex-wrap gap-3">
            {categorySkills.map((skill) => (
              <SkillItem key={skill.name} skill={skill} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Skills() {
  return (
    <SectionWrapper sectionId="skills">
      <section id="skills" className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
          Tech Network
        </h2>

        <div className="max-w-5xl mx-auto">
          <TechGraph />
        </div>
      </section>
    </SectionWrapper>
  );
}
