import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import ProjectSystemView from './ProjectSystemView';
import { Project } from '@/types';

// Mock EffectsContext
const mockSetOverlayActive = vi.fn();
vi.mock('@/contexts/EffectsContext', () => ({
  useEffects: () => ({
    setOverlayActive: mockSetOverlayActive,
    performanceTier: 'high',
    reducedMotion: false,
    effectsEnabled: true,
    overlayActive: false,
  }),
}));

// Mock LogContext
const mockAddEntry = vi.fn();
vi.mock('@/contexts/LogContext', () => ({
  useLog: () => ({
    addEntry: mockAddEntry,
  }),
}));

// Mock framer-motion to simplify testing
vi.mock('framer-motion', () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    div: ({ children, initial, animate, exit, transition, variants, ...domProps }: React.PropsWithChildren<Record<string, unknown>>) => {
      return <div {...domProps}>{children}</div>;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    p: ({ children, initial, animate, exit, transition, variants, ...domProps }: React.PropsWithChildren<Record<string, unknown>>) => {
      return <p {...domProps}>{children}</p>;
    },
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
  vi.clearAllMocks();
});

const mockProject: Project = {
  id: 'voiceowl-ai',
  name: 'VoiceOwl AI',
  description: 'Enterprise AI calling platform',
  problem: 'Manual calling is expensive',
  solution: 'AI-driven calling system',
  techStack: ['Node.js', 'NestJS', 'MongoDB', 'Redis', 'WebSocket'],
  contribution: 'Built real-time backend',
  impact: '150K+ daily users',
  githubUrl: 'https://github.com/test/voiceowl',
  liveUrl: 'https://voiceowl.ai',
  featured: true,
};

const mockNonVoiceOwlProject: Project = {
  id: 'other-project',
  name: 'Other Project',
  description: 'Some other project',
  problem: 'Some problem',
  solution: 'Some solution',
  techStack: ['React', 'TypeScript', 'Tailwind'],
  contribution: 'Built frontend',
  impact: 'Improved UX',
  githubUrl: 'https://github.com/test/other',
  liveUrl: 'https://other.com',
  featured: false,
};

const mockProjectNoLive: Project = {
  ...mockNonVoiceOwlProject,
  liveUrl: undefined,
};

describe('ProjectSystemView', () => {
  it('renders as a full-screen dialog overlay', () => {
    const onClose = vi.fn();
    render(<ProjectSystemView project={mockProject} onClose={onClose} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeDefined();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-label')).toBe('VoiceOwl AI system dashboard');
    expect(dialog.className).toContain('fixed');
    expect(dialog.className).toContain('inset-0');
    expect(dialog.className).toContain('z-[60]');
  });

  it('renders header with status dot, SYSTEM ACTIVE text, and project name', () => {
    const onClose = vi.fn();
    render(<ProjectSystemView project={mockProject} onClose={onClose} />);
    expect(screen.getByText('System Active')).toBeDefined();
    expect(screen.getByText('VoiceOwl AI')).toBeDefined();
  });

  it('renders close button that calls onClose', () => {
    const onClose = vi.fn();
    render(<ProjectSystemView project={mockProject} onClose={onClose} />);
    const closeButton = screen.getByLabelText('Close system view');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(<ProjectSystemView project={mockProject} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders live metrics panel with 3 cards', () => {
    const onClose = vi.fn();
    render(<ProjectSystemView project={mockProject} onClose={onClose} />);
    expect(screen.getByText('API Requests')).toBeDefined();
    expect(screen.getByText('Avg Latency')).toBeDefined();
    expect(screen.getByText('Uptime')).toBeDefined();
  });

  it('renders uptime as static 99.97%', () => {
    const onClose = vi.fn();
    render(<ProjectSystemView project={mockProject} onClose={onClose} />);
    expect(screen.getByText((content) => content.includes('99.97'))).toBeDefined();
  });

  it('renders architecture flow diagram with all nodes (non-VoiceOwl)', () => {
    const onClose = vi.fn();
    render(<ProjectSystemView project={mockNonVoiceOwlProject} onClose={onClose} />);
    expect(screen.getByText('Input')).toBeDefined();
    expect(screen.getByText('AI Router')).toBeDefined();
    expect(screen.getByText('Voice Engine')).toBeDefined();
    expect(screen.getByText('Output')).toBeDefined();
  });

  it('renders tech stack pills for all technologies (non-VoiceOwl)', () => {
    const onClose = vi.fn();
    render(<ProjectSystemView project={mockNonVoiceOwlProject} onClose={onClose} />);
    expect(screen.getByText('React')).toBeDefined();
    expect(screen.getByText('TypeScript')).toBeDefined();
    expect(screen.getByText('Tailwind')).toBeDefined();
  });

  it('renders GitHub and Live Demo action links (non-VoiceOwl)', () => {
    const onClose = vi.fn();
    render(<ProjectSystemView project={mockNonVoiceOwlProject} onClose={onClose} />);
    const githubLink = screen.getByText('GitHub').closest('a');
    expect(githubLink?.getAttribute('href')).toBe('https://github.com/test/other');
    expect(githubLink?.getAttribute('target')).toBe('_blank');

    const liveLink = screen.getByText('Live Demo').closest('a');
    expect(liveLink?.getAttribute('href')).toBe('https://other.com');
    expect(liveLink?.getAttribute('target')).toBe('_blank');
  });

  it('does not render Live Demo link when liveUrl is not provided (non-VoiceOwl)', () => {
    const onClose = vi.fn();
    render(<ProjectSystemView project={mockProjectNoLive} onClose={onClose} />);
    expect(screen.queryByText('Live Demo')).toBeNull();
  });

  it('prevents body scroll when open', () => {
    const onClose = vi.fn();
    render(<ProjectSystemView project={mockProject} onClose={onClose} />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('sets overlayActive to true on mount and false on unmount', () => {
    const onClose = vi.fn();
    const { unmount } = render(<ProjectSystemView project={mockProject} onClose={onClose} />);
    expect(mockSetOverlayActive).toHaveBeenCalledWith(true);
    unmount();
    expect(mockSetOverlayActive).toHaveBeenCalledWith(false);
  });

  it('renders metrics section with proper aria label', () => {
    const onClose = vi.fn();
    render(<ProjectSystemView project={mockProject} onClose={onClose} />);
    expect(screen.getByLabelText('Live metrics')).toBeDefined();
  });

  it('renders architecture section with proper aria label (non-VoiceOwl)', () => {
    const onClose = vi.fn();
    render(<ProjectSystemView project={mockNonVoiceOwlProject} onClose={onClose} />);
    expect(screen.getByLabelText('System architecture')).toBeDefined();
  });

  it('renders tech and links section with proper aria label (non-VoiceOwl)', () => {
    const onClose = vi.fn();
    render(<ProjectSystemView project={mockNonVoiceOwlProject} onClose={onClose} />);
    expect(screen.getByLabelText('Technology and links')).toBeDefined();
  });

  // VoiceOwl conditional rendering tests
  it('renders TabBar with 4 tabs for VoiceOwl project', () => {
    const onClose = vi.fn();
    render(<ProjectSystemView project={mockProject} onClose={onClose} />);
    expect(screen.getByRole('tablist')).toBeDefined();
    expect(screen.getByRole('tab', { name: /overview/i })).toBeDefined();
    expect(screen.getByRole('tab', { name: /architecture/i })).toBeDefined();
    expect(screen.getByRole('tab', { name: /features/i })).toBeDefined();
    expect(screen.getByRole('tab', { name: /contributions/i })).toBeDefined();
  });

  it('defaults to Overview tab active for VoiceOwl', () => {
    const onClose = vi.fn();
    render(<ProjectSystemView project={mockProject} onClose={onClose} />);
    const overviewTab = screen.getByRole('tab', { name: /overview/i });
    expect(overviewTab.getAttribute('aria-selected')).toBe('true');
  });

  it('does not render TabBar for non-VoiceOwl projects', () => {
    const onClose = vi.fn();
    render(<ProjectSystemView project={mockNonVoiceOwlProject} onClose={onClose} />);
    expect(screen.queryByRole('tablist')).toBeNull();
  });

  it('does not render architecture/tech sections for VoiceOwl project', () => {
    const onClose = vi.fn();
    render(<ProjectSystemView project={mockProject} onClose={onClose} />);
    expect(screen.queryByLabelText('System architecture')).toBeNull();
    expect(screen.queryByLabelText('Technology and links')).toBeNull();
  });

  it('renders tab panel with correct ARIA attributes for VoiceOwl', () => {
    const onClose = vi.fn();
    render(<ProjectSystemView project={mockProject} onClose={onClose} />);
    const panel = screen.getByRole('tabpanel');
    expect(panel.getAttribute('id')).toBe('panel-overview');
    expect(panel.getAttribute('aria-labelledby')).toBe('tab-overview');
  });

  it('preserves header and metrics for VoiceOwl project', () => {
    const onClose = vi.fn();
    render(<ProjectSystemView project={mockProject} onClose={onClose} />);
    expect(screen.getByText('System Active')).toBeDefined();
    expect(screen.getByLabelText('Live metrics')).toBeDefined();
    expect(screen.getByLabelText('Close system view')).toBeDefined();
  });
});
