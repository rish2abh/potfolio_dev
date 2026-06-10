import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SkillItem from './SkillItem';
import { Skill } from '@/types';

describe('SkillItem', () => {
  const mockSkill: Skill = { name: 'Node.js', category: 'Backend' };

  it('renders the skill name', () => {
    render(<SkillItem skill={mockSkill} />);
    expect(screen.getByText('Node.js')).toBeDefined();
  });

  it('renders with minimum 44x44px tap target class', () => {
    const { container } = render(<SkillItem skill={mockSkill} />);
    const element = container.firstElementChild as HTMLElement;
    expect(element.className).toContain('min-w-[44px]');
    expect(element.className).toContain('min-h-[44px]');
  });

  it('renders different skill names correctly', () => {
    const skills: Skill[] = [
      { name: 'MongoDB', category: 'Database' },
      { name: 'AWS S3', category: 'Cloud' },
      { name: 'Prompt Engineering', category: 'AI/Systems' },
    ];

    skills.forEach((skill) => {
      const { unmount } = render(<SkillItem skill={skill} />);
      expect(screen.getByText(skill.name)).toBeDefined();
      unmount();
    });
  });
});
