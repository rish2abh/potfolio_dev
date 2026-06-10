/**
 * Physics utility functions for creative effects.
 * All functions are pure and testable independently of DOM.
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface CardDimensions {
  width: number;
  height: number;
}

export interface TiltResult {
  rotateX: number;
  rotateY: number;
}

/**
 * Calculates repulsion force on a particle from the mouse position.
 *
 * Property 4: If Euclidean distance < radius, returns non-zero force pointing
 * away from mouse. If >= radius, force is (0, 0).
 *
 * @param particle - The particle position
 * @param mouse - The mouse/cursor position
 * @param radius - Repulsion radius in pixels (default 150)
 * @returns Force vector pointing away from mouse, or (0, 0) if outside radius
 */
export function calculateRepulsion(
  particle: Point2D,
  mouse: Point2D,
  radius: number = 150
): Vector2D {
  const dx = particle.x - mouse.x;
  const dy = particle.y - mouse.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance >= radius || distance === 0) {
    return { x: 0, y: 0 };
  }

  // Normalize direction (away from mouse) and scale by proximity
  const strength = (radius - distance) / radius;
  const nx = dx / distance;
  const ny = dy / distance;

  return {
    x: nx * strength,
    y: ny * strength,
  };
}

/**
 * Calculates magnetic translation for an element toward the cursor.
 *
 * Property 17: If distance < radius, returns vector pointing toward cursor
 * with magnitude ≤ strength. If >= radius, returns (0, 0).
 *
 * @param elemCenter - Center position of the element
 * @param cursor - The cursor position
 * @param radius - Proximity radius in pixels (default 60)
 * @param strength - Maximum translation in pixels (default 8)
 * @returns Translation vector toward cursor, or (0, 0) if outside radius
 */
export function calculateMagneticTranslation(
  elemCenter: Point2D,
  cursor: Point2D,
  radius: number = 60,
  strength: number = 8
): Vector2D {
  const dx = cursor.x - elemCenter.x;
  const dy = cursor.y - elemCenter.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance >= radius) {
    return { x: 0, y: 0 };
  }

  if (distance === 0) {
    return { x: 0, y: 0 };
  }

  // Scale translation proportionally to proximity (closer = stronger pull)
  const factor = (1 - distance / radius) * strength;
  const nx = dx / distance;
  const ny = dy / distance;

  return {
    x: nx * factor,
    y: ny * factor,
  };
}

/**
 * Determines whether a connecting line should be drawn between two particles.
 *
 * Property 18: Returns true if and only if Euclidean distance < threshold.
 *
 * @param p1 - First particle position
 * @param p2 - Second particle position
 * @param threshold - Distance threshold in pixels (default 120)
 * @returns true if particles are within threshold distance
 */
export function shouldDrawLine(
  p1: Point2D,
  p2: Point2D,
  threshold: number = 120
): boolean {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance < threshold;
}

/**
 * Calculates 3D tilt rotation angles for a card based on pointer position.
 *
 * Property 22: |rotateX| ≤ maxRotation and |rotateY| ≤ maxRotation,
 * proportional to pointer offset from card center.
 *
 * @param cardDims - Card width and height
 * @param pointerPos - Pointer position relative to the card's top-left corner
 * @param maxRotation - Maximum rotation in degrees (default 12)
 * @returns rotateX and rotateY angles in degrees
 */
export function calculateTilt(
  cardDims: CardDimensions,
  pointerPos: Point2D,
  maxRotation: number = 12
): TiltResult {
  if (cardDims.width <= 0 || cardDims.height <= 0) {
    return { rotateX: 0, rotateY: 0 };
  }

  // Calculate offset from center, normalized to [-1, 1]
  const centerX = cardDims.width / 2;
  const centerY = cardDims.height / 2;

  const offsetX = (pointerPos.x - centerX) / centerX;
  const offsetY = (pointerPos.y - centerY) / centerY;

  // Clamp to [-1, 1] range to handle pointer positions outside card bounds
  const clampedX = Math.max(-1, Math.min(1, offsetX));
  const clampedY = Math.max(-1, Math.min(1, offsetY));

  // rotateY: positive when pointer is to the right of center
  // rotateX: negative when pointer is below center (tilt away from pointer)
  return {
    rotateX: -clampedY * maxRotation || 0,
    rotateY: clampedX * maxRotation || 0,
  };
}
