'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { projects } from '@/data/projects';
import { projectArchitectures } from '@/data/architectures';
import ProjectCard from '@/components/ui/ProjectCard';
import SectionWrapper from '@/components/SectionWrapper';
import { useLog } from '@/contexts/LogContext';
import { Project } from '@/types';

const ProjectSystemView = dynamic(
  () => import('@/components/effects/ProjectSystemView'),
  { ssr: false }
);

export default function Projects() {
  const { addEntry } = useLog();
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Sort projects so featured (VoiceOwl AI) appears first
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  const handleExploreSystem = (project: Project) => {
    addEntry('AI', `Exploring ${project.name} architecture`);
    setActiveProject(project);
  };

  const handleCloseSystemView = () => {
    setActiveProject(null);
  };

  return (
    <SectionWrapper sectionId="projects">
      <section id="projects" className="py-32 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
          Active Systems
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedProjects.map((project) => (
            <div
              key={project.id}
              className={project.featured ? 'md:col-span-2 mb-8' : ''}
            >
              <ProjectCard
                project={project}
                isFeatured={project.featured}
                metrics={project.featured ? ['2M+ daily API requests', 'Real-time AI call routing', '99.9% uptime'] : undefined}
                hasArchitecture={!!projectArchitectures[project.id]}
                onExploreSystem={() => handleExploreSystem(project)}
              />
            </div>
          ))}
        </div>
      </section>

      {activeProject && projectArchitectures[activeProject.id] && (
        <ProjectSystemView
          project={activeProject}
          onClose={handleCloseSystemView}
        />
      )}
    </SectionWrapper>
  );
}
