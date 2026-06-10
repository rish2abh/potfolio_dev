import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import ProjectCard from './ProjectCard';
import { Project } from '@/types';

// Mock window.matchMedia for jsdom environment
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: query === '(pointer: fine)',
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

afterEach(() => {
  cleanup();
});

const baseProject: Project = {
  id: 'test-project',
  name: 'Test Project',
  description: 'A test project description',
  problem: 'Some problem that needs solving in the world of software development',
  solution: 'An innovative solution that addresses the problem with modern technology',
  techStack: ['Node.js', 'React', 'MongoDB'],
  contribution: 'Built the entire backend system',
  impact: '10x performance improvement',
  githubUrl: 'https://github.com/test/project',
  featured: false,
};

describe('ProjectCard', () => {
  it('renders the project name', () => {
    render(<ProjectCard project={baseProject} />);
    expect(screen.getByText('Test Project')).toBeDefined();
  });

  it('renders the project description', () => {
    render(<ProjectCard project={baseProject} />);
    expect(screen.getByText('A test project description')).toBeDefined();
  });

  it('renders all tech stack items', () => {
    render(<ProjectCard project={baseProject} />);
    baseProject.techStack.forEach((tech) => {
      expect(screen.getByText(tech)).toBeDefined();
    });
  });

  it('renders the contribution', () => {
    render(<ProjectCard project={baseProject} />);
    expect(screen.getByText(/Built the entire backend system/)).toBeDefined();
  });

  it('renders the impact', () => {
    render(<ProjectCard project={baseProject} />);
    expect(screen.getByText(/10x performance improvement/)).toBeDefined();
  });

  it('renders the GitHub link with correct attributes', () => {
    render(<ProjectCard project={baseProject} />);
    const githubLink = screen.getByText('GitHub →');
    expect(githubLink.getAttribute('href')).toBe('https://github.com/test/project');
    expect(githubLink.getAttribute('target')).toBe('_blank');
    expect(githubLink.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('does NOT render live demo link when liveUrl is undefined', () => {
    render(<ProjectCard project={baseProject} />);
    expect(screen.queryByText('Live Demo →')).toBeNull();
  });

  it('renders live demo link when liveUrl is defined', () => {
    const projectWithLiveUrl: Project = {
      ...baseProject,
      liveUrl: 'https://example.com/demo',
    };
    render(<ProjectCard project={projectWithLiveUrl} />);
    const liveLink = screen.getByText('Live Demo →');
    expect(liveLink.getAttribute('href')).toBe('https://example.com/demo');
    expect(liveLink.getAttribute('target')).toBe('_blank');
    expect(liveLink.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('uses an article element as the root', () => {
    const { container } = render(<ProjectCard project={baseProject} />);
    const article = container.querySelector('article');
    expect(article).not.toBeNull();
  });

  it('applies glassmorphism styling (backdrop-blur and semi-transparent bg)', () => {
    const { container } = render(<ProjectCard project={baseProject} />);
    const article = container.querySelector('article') as HTMLElement;
    expect(article.className).toContain('backdrop-blur');
    expect(article.className).toContain('bg-black/30');
    expect(article.className).toContain('border');
  });

  it('renders standard card with min-h-[200px] and border-white/10', () => {
    const { container } = render(<ProjectCard project={baseProject} />);
    const article = container.querySelector('article') as HTMLElement;
    expect(article.className).toContain('min-h-[200px]');
    expect(article.className).toContain('border-white/10');
  });

  it('renders standard card with 75% text opacity', () => {
    render(<ProjectCard project={baseProject} />);
    const name = screen.getByText('Test Project');
    expect(name.className).toContain('text-white/85');
  });
});

describe('ProjectCard - Featured Variant', () => {
  const featuredProject: Project = {
    ...baseProject,
    id: 'voiceowl-ai',
    name: 'VoiceOwl AI',
    featured: true,
  };

  const metrics = ['2M+ daily API requests', 'Real-time AI call routing', '99.9% uptime'];

  it('renders with voiceowl-card class when isFeatured is true', () => {
    const { container } = render(
      <ProjectCard project={featuredProject} isFeatured metrics={metrics} />
    );
    const article = container.querySelector('article') as HTMLElement;
    expect(article.className).toContain('voiceowl-card');
  });

  it('renders [PRIMARY SYSTEM] badge', () => {
    render(<ProjectCard project={featuredProject} isFeatured metrics={metrics} />);
    expect(screen.getByText('[PRIMARY SYSTEM]')).toBeDefined();
  });

  it('renders all metric badges', () => {
    render(<ProjectCard project={featuredProject} isFeatured metrics={metrics} />);
    metrics.forEach((metric) => {
      expect(screen.getByText(metric)).toBeDefined();
    });
  });

  it('renders with min-h-[400px] and p-8', () => {
    const { container } = render(
      <ProjectCard project={featuredProject} isFeatured metrics={metrics} />
    );
    const article = container.querySelector('article') as HTMLElement;
    expect(article.className).toContain('min-h-[400px]');
    expect(article.className).toContain('p-8');
  });

  it('renders with md:col-span-2 for desktop full-width', () => {
    const { container } = render(
      <ProjectCard project={featuredProject} isFeatured metrics={metrics} />
    );
    const perspectiveContainer = container.querySelector('[data-testid="featured-perspective-container"]') as HTMLElement;
    expect(perspectiveContainer.className).toContain('md:col-span-2');
  });

  it('renders Explore System button when hasArchitecture is true', () => {
    render(
      <ProjectCard
        project={featuredProject}
        isFeatured
        metrics={metrics}
        hasArchitecture
        onExploreSystem={() => {}}
      />
    );
    expect(screen.getByTestId('explore-system-button')).toBeDefined();
    expect(screen.getByText('Explore System →')).toBeDefined();
  });

  it('Explore System button has glow-neon-idle class', () => {
    render(
      <ProjectCard
        project={featuredProject}
        isFeatured
        metrics={metrics}
        hasArchitecture
        onExploreSystem={() => {}}
      />
    );
    const button = screen.getByTestId('explore-system-button');
    expect(button.className).toContain('glow-neon-idle');
  });

  it('renders project title at text-3xl on desktop', () => {
    render(<ProjectCard project={featuredProject} isFeatured metrics={metrics} />);
    const title = screen.getByText('VoiceOwl AI');
    expect(title.className).toContain('md:text-3xl');
  });
});

describe('ProjectCard - 3D Tilt Effect', () => {
  it('renders perspective container with perspective: 1000px for standard card', () => {
    const { container } = render(<ProjectCard project={baseProject} />);
    const perspectiveContainer = container.querySelector('[data-testid="standard-perspective-container"]') as HTMLElement;
    expect(perspectiveContainer).not.toBeNull();
    expect(perspectiveContainer.style.perspective).toBe('1000px');
  });

  it('renders perspective container with perspective: 1000px for featured card', () => {
    const featuredProject: Project = {
      ...baseProject,
      id: 'voiceowl-ai',
      name: 'VoiceOwl AI',
      featured: true,
    };
    const { container } = render(
      <ProjectCard project={featuredProject} isFeatured metrics={['metric1']} />
    );
    const perspectiveContainer = container.querySelector('[data-testid="featured-perspective-container"]') as HTMLElement;
    expect(perspectiveContainer).not.toBeNull();
    expect(perspectiveContainer.style.perspective).toBe('1000px');
  });

  it('applies preserve-3d transformStyle to article element', () => {
    const { container } = render(<ProjectCard project={baseProject} />);
    const article = container.querySelector('article') as HTMLElement;
    expect(article.style.transformStyle).toBe('preserve-3d');
  });

  it('applies 200ms ease-out transition to article element', () => {
    const { container } = render(<ProjectCard project={baseProject} />);
    const article = container.querySelector('article') as HTMLElement;
    expect(article.style.transition).toContain('transform 200ms ease-out');
  });

  it('initializes with zero tilt (rotateX(0deg) rotateY(0deg))', () => {
    const { container } = render(<ProjectCard project={baseProject} />);
    const article = container.querySelector('article') as HTMLElement;
    expect(article.style.transform).toContain('rotateX(0deg)');
    expect(article.style.transform).toContain('rotateY(0deg)');
  });
});
