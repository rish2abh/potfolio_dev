import { describe, it, expect } from 'vitest';
import {
  calculateRepulsion,
  calculateMagneticTranslation,
  shouldDrawLine,
  calculateTilt,
} from './physics-utils';

describe('calculateRepulsion', () => {
  it('returns zero force when particle is at exactly the radius distance', () => {
    const particle = { x: 150, y: 0 };
    const mouse = { x: 0, y: 0 };
    const result = calculateRepulsion(particle, mouse, 150);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  it('returns zero force when particle is beyond the radius', () => {
    const particle = { x: 200, y: 0 };
    const mouse = { x: 0, y: 0 };
    const result = calculateRepulsion(particle, mouse, 150);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  it('returns non-zero force pointing away from mouse when within radius', () => {
    const particle = { x: 100, y: 0 };
    const mouse = { x: 0, y: 0 };
    const result = calculateRepulsion(particle, mouse, 150);
    expect(result.x).toBeGreaterThan(0); // Pushes particle further from mouse (positive x direction)
    expect(result.y).toBe(0);
  });

  it('force vector points away from mouse (dot product with particle-to-mouse is negative)', () => {
    const particle = { x: 50, y: 50 };
    const mouse = { x: 100, y: 100 };
    const result = calculateRepulsion(particle, mouse, 150);

    // Particle-to-mouse vector
    const toMouseX = mouse.x - particle.x;
    const toMouseY = mouse.y - particle.y;

    // Dot product of force and particle-to-mouse should be negative (pointing away)
    const dot = result.x * toMouseX + result.y * toMouseY;
    expect(dot).toBeLessThan(0);
  });

  it('returns zero force when particle and mouse are at the same position', () => {
    const particle = { x: 50, y: 50 };
    const mouse = { x: 50, y: 50 };
    const result = calculateRepulsion(particle, mouse, 150);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  it('produces stronger force for closer particles', () => {
    const mouse = { x: 0, y: 0 };
    const close = calculateRepulsion({ x: 30, y: 0 }, mouse, 150);
    const far = calculateRepulsion({ x: 120, y: 0 }, mouse, 150);
    expect(Math.abs(close.x)).toBeGreaterThan(Math.abs(far.x));
  });
});

describe('calculateMagneticTranslation', () => {
  it('returns zero translation when cursor is at exactly the radius', () => {
    const elem = { x: 0, y: 0 };
    const cursor = { x: 60, y: 0 };
    const result = calculateMagneticTranslation(elem, cursor, 60, 8);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  it('returns zero translation when cursor is beyond the radius', () => {
    const elem = { x: 0, y: 0 };
    const cursor = { x: 100, y: 0 };
    const result = calculateMagneticTranslation(elem, cursor, 60, 8);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  it('returns translation pointing toward cursor when within radius', () => {
    const elem = { x: 0, y: 0 };
    const cursor = { x: 30, y: 0 };
    const result = calculateMagneticTranslation(elem, cursor, 60, 8);
    expect(result.x).toBeGreaterThan(0); // Points toward cursor (positive x)
    expect(result.y).toBe(0);
  });

  it('translation magnitude does not exceed strength', () => {
    const elem = { x: 0, y: 0 };
    const cursor = { x: 10, y: 10 }; // Very close
    const result = calculateMagneticTranslation(elem, cursor, 60, 8);
    const magnitude = Math.sqrt(result.x * result.x + result.y * result.y);
    expect(magnitude).toBeLessThanOrEqual(8);
  });

  it('returns zero translation when cursor is at element center', () => {
    const elem = { x: 50, y: 50 };
    const cursor = { x: 50, y: 50 };
    const result = calculateMagneticTranslation(elem, cursor, 60, 8);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  it('closer cursor produces stronger translation', () => {
    const elem = { x: 0, y: 0 };
    const close = calculateMagneticTranslation(elem, { x: 10, y: 0 }, 60, 8);
    const far = calculateMagneticTranslation(elem, { x: 50, y: 0 }, 60, 8);
    expect(Math.abs(close.x)).toBeGreaterThan(Math.abs(far.x));
  });
});

describe('shouldDrawLine', () => {
  it('returns true when distance is less than threshold', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 100, y: 0 };
    expect(shouldDrawLine(p1, p2, 120)).toBe(true);
  });

  it('returns false when distance equals threshold', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 120, y: 0 };
    expect(shouldDrawLine(p1, p2, 120)).toBe(false);
  });

  it('returns false when distance exceeds threshold', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 200, y: 0 };
    expect(shouldDrawLine(p1, p2, 120)).toBe(false);
  });

  it('returns true when particles are at the same position', () => {
    const p1 = { x: 50, y: 50 };
    const p2 = { x: 50, y: 50 };
    expect(shouldDrawLine(p1, p2, 120)).toBe(true);
  });

  it('works correctly with diagonal distances', () => {
    // Distance = sqrt(80^2 + 80^2) ≈ 113.14 < 120
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 80, y: 80 };
    expect(shouldDrawLine(p1, p2, 120)).toBe(true);

    // Distance = sqrt(90^2 + 90^2) ≈ 127.28 > 120
    const p3 = { x: 0, y: 0 };
    const p4 = { x: 90, y: 90 };
    expect(shouldDrawLine(p3, p4, 120)).toBe(false);
  });
});

describe('calculateTilt', () => {
  it('returns zero rotation when pointer is at card center', () => {
    const cardDims = { width: 300, height: 200 };
    const pointer = { x: 150, y: 100 };
    const result = calculateTilt(cardDims, pointer, 12);
    expect(result.rotateX).toBe(0);
    expect(result.rotateY).toBe(0);
  });

  it('rotateX and rotateY are bounded by maxRotation', () => {
    const cardDims = { width: 300, height: 200 };
    // Pointer at top-right corner
    const pointer = { x: 300, y: 0 };
    const result = calculateTilt(cardDims, pointer, 12);
    expect(Math.abs(result.rotateX)).toBeLessThanOrEqual(12);
    expect(Math.abs(result.rotateY)).toBeLessThanOrEqual(12);
  });

  it('rotateY is positive when pointer is right of center', () => {
    const cardDims = { width: 300, height: 200 };
    const pointer = { x: 250, y: 100 }; // Right of center, vertically centered
    const result = calculateTilt(cardDims, pointer, 12);
    expect(result.rotateY).toBeGreaterThan(0);
    expect(result.rotateX).toBeCloseTo(0);
  });

  it('rotateX is negative when pointer is below center', () => {
    const cardDims = { width: 300, height: 200 };
    const pointer = { x: 150, y: 150 }; // Below center, horizontally centered
    const result = calculateTilt(cardDims, pointer, 12);
    expect(result.rotateX).toBeLessThan(0);
    expect(result.rotateY).toBeCloseTo(0);
  });

  it('tilt is proportional to offset from center', () => {
    const cardDims = { width: 400, height: 400 };
    const halfOffset = calculateTilt(cardDims, { x: 300, y: 200 }, 12); // 50% offset on x
    const fullOffset = calculateTilt(cardDims, { x: 400, y: 200 }, 12); // 100% offset on x
    expect(Math.abs(fullOffset.rotateY)).toBeGreaterThan(Math.abs(halfOffset.rotateY));
  });

  it('returns zero rotation for zero-dimension cards', () => {
    const cardDims = { width: 0, height: 200 };
    const pointer = { x: 50, y: 50 };
    const result = calculateTilt(cardDims, pointer, 12);
    expect(result.rotateX).toBe(0);
    expect(result.rotateY).toBe(0);
  });

  it('clamps rotation when pointer is outside card bounds', () => {
    const cardDims = { width: 200, height: 200 };
    // Pointer far outside card bounds
    const pointer = { x: 500, y: 500 };
    const result = calculateTilt(cardDims, pointer, 12);
    expect(Math.abs(result.rotateX)).toBeLessThanOrEqual(12);
    expect(Math.abs(result.rotateY)).toBeLessThanOrEqual(12);
  });
});
