import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import TimelineEntry from './TimelineEntry';
import { Experience } from '@/types';

afterEach(() => {
  cleanup();
});

describe('TimelineEntry', () => {
  const mockExperience: Experience = {
    id: 'test-company',
    company: 'Test Corp',
    role: 'Senior Engineer',
    startDate: 'Jan 2023',
    endDate: 'Present',
    description: 'Built scalable backend services for enterprise clients',
    contributions: [
      'Designed microservices architecture',
      'Implemented CI/CD pipelines',
      'Led code review process',
    ],
    impact: '50% reduction in deployment time, 99.9% uptime',
  };

  it('renders the company name', () => {
    render(<TimelineEntry experience={mockExperience} />);
    expect(screen.getByText('Test Corp')).toBeDefined();
  });

  it('renders the role title', () => {
    render(<TimelineEntry experience={mockExperience} />);
    expect(screen.getByText('Senior Engineer')).toBeDefined();
  });

  it('renders the employment dates', () => {
    render(<TimelineEntry experience={mockExperience} />);
    expect(screen.getByText('Jan 2023 – Present')).toBeDefined();
  });

  it('renders the description', () => {
    render(<TimelineEntry experience={mockExperience} />);
    expect(screen.getByText('Built scalable backend services for enterprise clients')).toBeDefined();
  });

  it('renders all contributions', () => {
    render(<TimelineEntry experience={mockExperience} />);
    expect(screen.getByText('Designed microservices architecture')).toBeDefined();
    expect(screen.getByText('Implemented CI/CD pipelines')).toBeDefined();
    expect(screen.getByText('Led code review process')).toBeDefined();
  });

  it('renders the measurable impact', () => {
    render(<TimelineEntry experience={mockExperience} />);
    expect(screen.getByText('50% reduction in deployment time, 99.9% uptime')).toBeDefined();
  });

  it('includes the visual connector element (dot node)', () => {
    const { container } = render(<TimelineEntry experience={mockExperience} />);
    const dot = container.querySelector('.rounded-full');
    expect(dot).not.toBeNull();
  });

  it('includes the visual connector element (vertical line)', () => {
    const { container } = render(<TimelineEntry experience={mockExperience} />);
    const line = container.querySelector('.w-0\\.5');
    expect(line).not.toBeNull();
  });
});
