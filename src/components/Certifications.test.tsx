import { describe, it, expect, afterEach, beforeAll, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import Certifications from './Certifications';

beforeAll(() => {
  const mockIntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
  vi.stubGlobal('IntersectionObserver', mockIntersectionObserver);
});

vi.mock('@/data/certifications', () => ({
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date: '2024',
      verificationUrl: 'https://verify.aws/cert-1',
    },
    {
      id: 'cert-2',
      name: 'Google AI',
      issuer: 'Google',
      date: '2023',
    },
  ],
}));

afterEach(() => {
  cleanup();
});

describe('Certifications', () => {
  it('renders the section heading', () => {
    render(<Certifications />);
    expect(screen.getByText('Certifications')).toBeDefined();
  });

  it('renders certification names', () => {
    render(<Certifications />);
    expect(screen.getByText('AWS Cloud Practitioner')).toBeDefined();
    expect(screen.getByText('Google AI')).toBeDefined();
  });

  it('renders certification issuers', () => {
    render(<Certifications />);
    expect(screen.getByText('Amazon Web Services')).toBeDefined();
    expect(screen.getByText('Google')).toBeDefined();
  });

  it('renders certification dates', () => {
    render(<Certifications />);
    expect(screen.getByText('2024')).toBeDefined();
    expect(screen.getByText('2023')).toBeDefined();
  });

  it('renders verification link when verificationUrl is defined', () => {
    render(<Certifications />);
    const links = screen.getAllByText('Verify Credential →');
    expect(links.length).toBe(1);
    const link = links[0] as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('https://verify.aws/cert-1');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('does NOT render verification link when verificationUrl is undefined', () => {
    render(<Certifications />);
    // Only one "Verify Credential" link should exist (for cert-1)
    const links = screen.getAllByText('Verify Credential →');
    expect(links.length).toBe(1);
  });

  it('has the correct section id for navigation', () => {
    const { container } = render(<Certifications />);
    const section = container.querySelector('#certifications');
    expect(section).not.toBeNull();
  });

  it('uses responsive grid layout classes', () => {
    const { container } = render(<Certifications />);
    const grid = container.querySelector('.grid');
    expect(grid).not.toBeNull();
    expect(grid!.className).toContain('grid-cols-1');
    expect(grid!.className).toContain('md:grid-cols-2');
    expect(grid!.className).toContain('lg:grid-cols-3');
  });
});
