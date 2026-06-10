import { describe, it, expect } from 'vitest';
import {
  calculateStaggerDelays,
  calculateScrollDuration,
  getLogColor,
  assessDeviceCapabilities,
  resolveCursorState,
  calculateParallaxOffset,
  fluctuateLatency,
  calculateFocalSection,
  calculateCardTilt,
} from './layout-utils';

describe('calculateParallaxOffset', () => {
  it('returns {0, 0} when cursor is at viewport center', () => {
    const result = calculateParallaxOffset(500, 400, 1000, 800);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  it('returns positive x when cursor is to the right of center', () => {
    const result = calculateParallaxOffset(750, 400, 1000, 800);
    expect(result.x).toBeGreaterThan(0);
    expect(result.x).toBeLessThanOrEqual(15);
  });

  it('returns negative x when cursor is to the left of center', () => {
    const result = calculateParallaxOffset(250, 400, 1000, 800);
    expect(result.x).toBeLessThan(0);
    expect(result.x).toBeGreaterThanOrEqual(-15);
  });

  it('returns maximum offset of 15px at viewport edges', () => {
    const result = calculateParallaxOffset(1000, 800, 1000, 800);
    expect(result.x).toBe(15);
    expect(result.y).toBe(15);
  });

  it('returns minimum offset of -15px at viewport origin', () => {
    const result = calculateParallaxOffset(0, 0, 1000, 800);
    expect(result.x).toBe(-15);
    expect(result.y).toBe(-15);
  });

  it('clamps values beyond viewport bounds', () => {
    const result = calculateParallaxOffset(2000, 2000, 1000, 800);
    expect(result.x).toBe(15);
    expect(result.y).toBe(15);
  });

  it('returns {0, 0} for zero viewport dimensions', () => {
    const result = calculateParallaxOffset(100, 100, 0, 0);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });
});

describe('fluctuateLatency', () => {
  it('returns a value within ±5ms of base', () => {
    for (let i = 0; i < 100; i++) {
      const result = fluctuateLatency(30);
      expect(result).toBeGreaterThanOrEqual(25);
      expect(result).toBeLessThanOrEqual(35);
    }
  });

  it('never returns a value below 0', () => {
    for (let i = 0; i < 100; i++) {
      const result = fluctuateLatency(2);
      expect(result).toBeGreaterThanOrEqual(0);
    }
  });

  it('returns 0 when base is 0 and fluctuation goes negative', () => {
    for (let i = 0; i < 100; i++) {
      const result = fluctuateLatency(0);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(5);
    }
  });
});

describe('calculateFocalSection', () => {
  it('returns null for empty sections array', () => {
    expect(calculateFocalSection([], 800)).toBeNull();
  });

  it('returns the only section when one is provided', () => {
    const sections = [{ id: 'hero', rect: { top: 0, bottom: 800, height: 800 } }];
    expect(calculateFocalSection(sections, 800)).toBe('hero');
  });

  it('returns section closest to viewport center', () => {
    const sections = [
      { id: 'hero', rect: { top: -600, bottom: 200, height: 800 } },
      { id: 'about', rect: { top: 200, bottom: 600, height: 400 } },
      { id: 'skills', rect: { top: 600, bottom: 1000, height: 400 } },
    ];
    // Viewport center = 400
    // hero center = -600 + 400 = -200, distance = 600
    // about center = 200 + 200 = 400, distance = 0
    // skills center = 600 + 200 = 800, distance = 400
    expect(calculateFocalSection(sections, 800)).toBe('about');
  });

  it('returns first section when multiple are equidistant', () => {
    const sections = [
      { id: 'a', rect: { top: 100, bottom: 300, height: 200 } },
      { id: 'b', rect: { top: 500, bottom: 700, height: 200 } },
    ];
    // Viewport center = 400
    // a center = 200, distance = 200
    // b center = 600, distance = 200
    // First wins (a)
    expect(calculateFocalSection(sections, 800)).toBe('a');
  });
});

describe('calculateCardTilt', () => {
  it('returns {0, 0} when cursor is at card center', () => {
    const result = calculateCardTilt(150, 100, { x: 100, y: 50, width: 100, height: 100 }, 5);
    expect(result.tiltX).toBe(0);
    expect(result.tiltY).toBe(0);
  });

  it('returns positive tiltY when cursor is to the right of card center', () => {
    const result = calculateCardTilt(200, 100, { x: 100, y: 50, width: 100, height: 100 }, 5);
    expect(result.tiltY).toBeGreaterThan(0);
    expect(result.tiltY).toBeLessThanOrEqual(5);
  });

  it('returns negative tiltX when cursor is below card center (inverted)', () => {
    const result = calculateCardTilt(150, 150, { x: 100, y: 50, width: 100, height: 100 }, 5);
    expect(result.tiltX).toBeLessThan(0);
  });

  it('clamps tilt to ±maxAngle', () => {
    // Cursor far outside card
    const result = calculateCardTilt(500, 500, { x: 100, y: 50, width: 100, height: 100 }, 5);
    expect(result.tiltX).toBeGreaterThanOrEqual(-5);
    expect(result.tiltX).toBeLessThanOrEqual(5);
    expect(result.tiltY).toBeGreaterThanOrEqual(-5);
    expect(result.tiltY).toBeLessThanOrEqual(5);
  });

  it('returns {0, 0} for zero-dimension card', () => {
    const result = calculateCardTilt(150, 100, { x: 100, y: 50, width: 0, height: 0 }, 5);
    expect(result.tiltX).toBe(0);
    expect(result.tiltY).toBe(0);
  });

  it('respects custom maxAngle', () => {
    // Cursor at edge of card
    const result = calculateCardTilt(200, 100, { x: 100, y: 50, width: 100, height: 100 }, 10);
    expect(result.tiltY).toBeLessThanOrEqual(10);
    expect(result.tiltY).toBeGreaterThanOrEqual(-10);
  });
});

describe('calculateStaggerDelays', () => {
  it('returns empty array for count 0', () => {
    expect(calculateStaggerDelays(0)).toEqual([]);
  });

  it('returns baseDelay for each item when count <= maxDuration/baseDelay', () => {
    // Default: 1200/150 = 8, so count=5 should give 5 items of 150ms each
    const delays = calculateStaggerDelays(5);
    expect(delays).toHaveLength(5);
    expect(delays.every((d) => d === 150)).toBe(true);
  });

  it('returns baseDelay for exactly threshold items', () => {
    // threshold = 1200/150 = 8
    const delays = calculateStaggerDelays(8);
    expect(delays).toHaveLength(8);
    expect(delays.every((d) => d === 150)).toBe(true);
  });

  it('reduces delay proportionally for counts above threshold', () => {
    // count=20 > threshold=8, adjusted delay = 1200/20 = 60
    const delays = calculateStaggerDelays(20);
    expect(delays).toHaveLength(20);
    expect(delays.every((d) => d === 60)).toBe(true);
  });

  it('sum never exceeds maxDuration for large counts', () => {
    const delays = calculateStaggerDelays(100);
    const sum = delays.reduce((a, b) => a + b, 0);
    expect(sum).toBeLessThanOrEqual(1200);
  });

  it('works with custom baseDelay and maxDuration', () => {
    const delays = calculateStaggerDelays(5, 100, 800);
    // threshold = 800/100 = 8, count=5 <= 8
    expect(delays).toHaveLength(5);
    expect(delays.every((d) => d === 100)).toBe(true);
  });

  it('adjusts with custom params when count exceeds threshold', () => {
    const delays = calculateStaggerDelays(20, 100, 800);
    // threshold = 800/100 = 8, count=20 > 8, adjusted = 800/20 = 40
    expect(delays).toHaveLength(20);
    const sum = delays.reduce((a, b) => a + b, 0);
    expect(sum).toBeLessThanOrEqual(800);
  });
});

describe('calculateScrollDuration', () => {
  it('returns 300ms for distance 0', () => {
    expect(calculateScrollDuration(0)).toBe(300);
  });

  it('returns 800ms for very large distances', () => {
    expect(calculateScrollDuration(5000)).toBe(800);
    expect(calculateScrollDuration(100000)).toBe(800);
  });

  it('returns value between 300 and 800 for moderate distances', () => {
    const duration = calculateScrollDuration(1000);
    expect(duration).toBeGreaterThanOrEqual(300);
    expect(duration).toBeLessThanOrEqual(800);
  });

  it('is monotonically increasing', () => {
    const d1 = calculateScrollDuration(100);
    const d2 = calculateScrollDuration(500);
    const d3 = calculateScrollDuration(1500);
    expect(d2).toBeGreaterThanOrEqual(d1);
    expect(d3).toBeGreaterThanOrEqual(d2);
  });

  it('handles negative distance using absolute value', () => {
    expect(calculateScrollDuration(-1000)).toBe(calculateScrollDuration(1000));
  });
});

describe('getLogColor', () => {
  it('returns blue for INFO', () => {
    expect(getLogColor('INFO')).toBe('blue');
  });

  it('returns green for OK', () => {
    expect(getLogColor('OK')).toBe('green');
  });

  it('returns yellow for AI', () => {
    expect(getLogColor('AI')).toBe('yellow');
  });

  it('returns purple for ACTION', () => {
    expect(getLogColor('ACTION')).toBe('purple');
  });
});

describe('assessDeviceCapabilities', () => {
  it('disables all features for 1 core', () => {
    const caps = assessDeviceCapabilities(1);
    expect(caps.particleLines).toBe(false);
    expect(caps.cursorTrail).toBe(false);
    expect(caps.spotlight).toBe(false);
    expect(caps.flowAutoLoop).toBe(false);
  });

  it('disables all features for 2 cores', () => {
    const caps = assessDeviceCapabilities(2);
    expect(caps.particleLines).toBe(false);
    expect(caps.cursorTrail).toBe(false);
    expect(caps.spotlight).toBe(false);
    expect(caps.flowAutoLoop).toBe(false);
  });

  it('enables all features for 3 cores', () => {
    const caps = assessDeviceCapabilities(3);
    expect(caps.particleLines).toBe(true);
    expect(caps.cursorTrail).toBe(true);
    expect(caps.spotlight).toBe(true);
    expect(caps.flowAutoLoop).toBe(true);
  });

  it('enables all features for 8 cores', () => {
    const caps = assessDeviceCapabilities(8);
    expect(caps.particleLines).toBe(true);
    expect(caps.cursorTrail).toBe(true);
    expect(caps.spotlight).toBe(true);
    expect(caps.flowAutoLoop).toBe(true);
  });
});

describe('resolveCursorState', () => {
  it('returns label "Explore" and scale 1.0 for project-card', () => {
    const state = resolveCursorState('project-card');
    expect(state.label).toBe('Explore');
    expect(state.scale).toBe(1.0);
  });

  it('returns label "Open" and scale 1.0 for external-link', () => {
    const state = resolveCursorState('external-link');
    expect(state.label).toBe('Open');
    expect(state.scale).toBe(1.0);
  });

  it('returns label null and scale 1.5 for button', () => {
    const state = resolveCursorState('button');
    expect(state.label).toBeNull();
    expect(state.scale).toBe(1.5);
  });

  it('returns label null and scale 1.0 for other', () => {
    const state = resolveCursorState('other');
    expect(state.label).toBeNull();
    expect(state.scale).toBe(1.0);
  });

  it('returns label null and scale 1.0 for unknown types', () => {
    const state = resolveCursorState('unknown-element');
    expect(state.label).toBeNull();
    expect(state.scale).toBe(1.0);
  });
});
