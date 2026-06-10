import { describe, it, expect } from 'vitest';
import { projects } from '@/data/projects';
import { experience } from '@/data/experience';
import { skills } from '@/data/skills';
import { certifications } from '@/data/certifications';
import { personalInfo } from '@/data/personal';

/**
 * Smoke tests verifying the app's core data modules export valid data
 * and the project structure is intact for a successful build.
 */
describe('Build smoke tests', () => {
  it('exports projects data with required fields', () => {
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);

    for (const project of projects) {
      expect(project.id).toBeTruthy();
      expect(project.name).toBeTruthy();
      expect(project.description).toBeTruthy();
      expect(project.techStack.length).toBeGreaterThanOrEqual(2);
      expect(project.githubUrl).toBeTruthy();
    }
  });

  it('exports experience data with required fields', () => {
    expect(Array.isArray(experience)).toBe(true);
    expect(experience.length).toBeGreaterThan(0);

    for (const entry of experience) {
      expect(entry.id).toBeTruthy();
      expect(entry.company).toBeTruthy();
      expect(entry.role).toBeTruthy();
      expect(entry.startDate).toBeTruthy();
      expect(entry.endDate).toBeTruthy();
      expect(entry.contributions.length).toBeGreaterThan(0);
    }
  });

  it('exports skills data with valid categories', () => {
    expect(Array.isArray(skills)).toBe(true);
    expect(skills.length).toBeGreaterThan(0);

    const validCategories = ['Backend', 'Database', 'Cloud', 'AI/Systems'];
    for (const skill of skills) {
      expect(skill.name).toBeTruthy();
      expect(validCategories).toContain(skill.category);
    }
  });

  it('exports certifications data with required fields', () => {
    expect(Array.isArray(certifications)).toBe(true);
    expect(certifications.length).toBeGreaterThan(0);

    for (const cert of certifications) {
      expect(cert.id).toBeTruthy();
      expect(cert.name).toBeTruthy();
      expect(cert.issuer).toBeTruthy();
      expect(cert.date).toBeTruthy();
    }
  });

  it('exports personal info with required fields', () => {
    expect(personalInfo).toBeDefined();
    expect(personalInfo.name).toBeTruthy();
    expect(personalInfo.role).toBeTruthy();
    expect(personalInfo.tagline).toBeTruthy();
    expect(personalInfo.github).toContain('github.com');
    expect(personalInfo.linkedin).toContain('linkedin.com');
  });
});
