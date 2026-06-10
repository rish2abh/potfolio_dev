import type { LogEntry } from '@/types/effects';

/**
 * Device capability feature flags returned by assessDeviceCapabilities.
 */
export interface DeviceCapabilities {
  particleLines: boolean;
  cursorTrail: boolean;
  spotlight: boolean;
  flowAutoLoop: boolean;
}

/**
 * Cursor state returned by resolveCursorState.
 */
export interface CursorState {
  label: string | null;
  scale: number;
}

/**
 * Parallax offset result for cursor-based parallax effects.
 */
export interface ParallaxOffset {
  x: number;
  y: number;
}

/**
 * Card tilt angles for 3D perspective tilt effects.
 */
export interface CardTilt {
  tiltX: number;
  tiltY: number;
}

/**
 * Calculates parallax offset based on cursor position relative to viewport center.
 * Maximum displacement: ±15px on each axis.
 * Formula: offset = ((cursor - center) / center) * maxOffset, clamped to [-15, 15]
 *
 * @param cursorX - Current cursor X position in pixels
 * @param cursorY - Current cursor Y position in pixels
 * @param viewportWidth - Viewport width in pixels
 * @param viewportHeight - Viewport height in pixels
 * @returns {x, y} offset clamped to ±15px
 */
export function calculateParallaxOffset(
  cursorX: number,
  cursorY: number,
  viewportWidth: number,
  viewportHeight: number
): ParallaxOffset {
  const maxOffset = 15;

  if (viewportWidth <= 0 || viewportHeight <= 0) {
    return { x: 0, y: 0 };
  }

  const centerX = viewportWidth / 2;
  const centerY = viewportHeight / 2;

  const rawX = ((cursorX - centerX) / centerX) * maxOffset;
  const rawY = ((cursorY - centerY) / centerY) * maxOffset;

  return {
    x: Math.max(-maxOffset, Math.min(maxOffset, rawX)),
    y: Math.max(-maxOffset, Math.min(maxOffset, rawY)),
  };
}

/**
 * Returns a new latency value that fluctuates by ±5ms from the base.
 * The result is always bounded (never goes below 0).
 * Used by SystemStatusIndicator HUD to simulate network jitter.
 *
 * @param baseLatency - The base latency value in ms
 * @returns A fluctuated latency value within [max(0, base-5), base+5]
 */
export function fluctuateLatency(baseLatency: number): number {
  const fluctuation = (Math.random() * 10) - 5; // Random value in [-5, 5]
  const result = baseLatency + fluctuation;
  return Math.max(0, result);
}

/**
 * Section descriptor for focal section calculation.
 */
export interface SectionRect {
  id: string;
  rect: { top: number; bottom: number; height: number };
}

/**
 * Calculates which section's center is closest to the viewport center.
 * Used by FocalGlowManager to determine which section gets full opacity.
 * Returns exactly one section ID, or null if no sections are provided.
 *
 * @param sections - Array of sections with their bounding rect info
 * @param viewportHeight - The viewport height in pixels
 * @returns The section ID closest to viewport center, or null
 */
export function calculateFocalSection(
  sections: SectionRect[],
  viewportHeight: number
): string | null {
  if (sections.length === 0) return null;

  const viewportCenter = viewportHeight / 2;
  let closestId: string | null = null;
  let closestDistance = Infinity;

  for (const section of sections) {
    const sectionCenter = section.rect.top + section.rect.height / 2;
    const distance = Math.abs(sectionCenter - viewportCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestId = section.id;
    }
  }

  return closestId;
}

/**
 * Calculates 3D perspective tilt angles for a card based on cursor position
 * relative to the card center. Clamped to ±maxAngle degrees.
 * Used for 3D perspective tilt on ProjectCards.
 *
 * @param cursorX - Cursor X position in pixels
 * @param cursorY - Cursor Y position in pixels
 * @param cardRect - The card's bounding rectangle {x, y, width, height}
 * @param maxAngle - Maximum tilt angle in degrees (typically 5)
 * @returns {tiltX, tiltY} angles clamped to ±maxAngle
 */
export function calculateCardTilt(
  cursorX: number,
  cursorY: number,
  cardRect: { x: number; y: number; width: number; height: number },
  maxAngle: number
): CardTilt {
  if (cardRect.width <= 0 || cardRect.height <= 0) {
    return { tiltX: 0, tiltY: 0 };
  }

  const cardCenterX = cardRect.x + cardRect.width / 2;
  const cardCenterY = cardRect.y + cardRect.height / 2;

  // Calculate offset from card center normalized to [-1, 1]
  const normalizedX = (cursorX - cardCenterX) / (cardRect.width / 2);
  const normalizedY = (cursorY - cardCenterY) / (cardRect.height / 2);

  // tiltY rotates around Y-axis (horizontal cursor movement causes Y rotation)
  // tiltX rotates around X-axis (vertical cursor movement causes X rotation, inverted)
  const rawTiltY = normalizedX * maxAngle;
  const rawTiltX = -normalizedY * maxAngle;

  const clampedTiltX = Math.max(-maxAngle, Math.min(maxAngle, rawTiltX));
  const clampedTiltY = Math.max(-maxAngle, Math.min(maxAngle, rawTiltY));

  return {
    tiltX: clampedTiltX === 0 ? 0 : clampedTiltX,
    tiltY: clampedTiltY === 0 ? 0 : clampedTiltY,
  };
}

/**
 * Calculates stagger delays for a group of child elements.
 *
 * For child counts <= maxDuration/baseDelay, each delay equals baseDelay.
 * For larger counts, delays are proportionally reduced so that
 * the sum never exceeds maxDuration.
 *
 * @param childCount - Number of child elements (1+)
 * @param baseDelay - Base delay per item in ms (default 150)
 * @param maxDuration - Maximum total animation duration in ms (default 1200)
 * @returns Array of per-item delay values in ms
 */
export function calculateStaggerDelays(
  childCount: number,
  baseDelay: number = 150,
  maxDuration: number = 1200
): number[] {
  if (childCount <= 0) return [];

  const threshold = Math.floor(maxDuration / baseDelay);

  if (childCount <= threshold) {
    // Each item gets the full baseDelay
    return Array(childCount).fill(baseDelay);
  }

  // Proportionally reduce delay so total doesn't exceed maxDuration
  const adjustedDelay = maxDuration / childCount;
  return Array(childCount).fill(adjustedDelay);
}

/**
 * Calculates smooth scroll duration based on distance.
 *
 * Returns a value between 300ms and 800ms inclusive,
 * monotonically increasing with distance.
 *
 * @param distance - Scroll distance in pixels (absolute value used)
 * @returns Duration in ms, clamped to [300, 800]
 */
export function calculateScrollDuration(distance: number): number {
  const absDistance = Math.abs(distance);

  // Linear interpolation clamped to [300, 800]
  // At 0px → 300ms, at 2000px+ → 800ms
  const minDuration = 300;
  const maxDuration = 800;
  const maxDistance = 2000;

  const duration = minDuration + (absDistance / maxDistance) * (maxDuration - minDuration);

  return Math.min(maxDuration, Math.max(minDuration, duration));
}

/**
 * Returns the color string for a given log entry level.
 *
 * Mapping is total and deterministic:
 * - INFO → blue
 * - OK → green
 * - AI → yellow
 * - ACTION → purple
 *
 * @param level - Log entry level
 * @returns Color string
 */
export function getLogColor(level: LogEntry['level']): string {
  const colorMap: Record<LogEntry['level'], string> = {
    INFO: 'blue',
    OK: 'green',
    AI: 'yellow',
    ACTION: 'purple',
  };

  return colorMap[level];
}

/**
 * Assesses device capabilities based on hardware concurrency (core count).
 *
 * - cores <= 2: disables particleLines, cursorTrail, spotlight, flowAutoLoop
 * - cores > 2: enables all features
 *
 * @param cores - Number of hardware threads (navigator.hardwareConcurrency)
 * @returns Feature flags object
 */
export function assessDeviceCapabilities(cores: number): DeviceCapabilities {
  if (cores <= 2) {
    return {
      particleLines: false,
      cursorTrail: false,
      spotlight: false,
      flowAutoLoop: false,
    };
  }

  return {
    particleLines: true,
    cursorTrail: true,
    spotlight: true,
    flowAutoLoop: true,
  };
}

/**
 * Resolves the cursor state (label and scale) based on the element type being hovered.
 *
 * Mapping:
 * - 'project-card' → label "Explore", scale 1.0
 * - 'external-link' → label "Open", scale 1.0
 * - 'button' → label null, scale 1.5
 * - 'other' (or any other value) → label null, scale 1.0
 *
 * @param elementType - The type of element being hovered
 * @returns CursorState with label and scale
 */
export function resolveCursorState(elementType: string): CursorState {
  switch (elementType) {
    case 'project-card':
      return { label: 'Explore', scale: 1.0 };
    case 'external-link':
      return { label: 'Open', scale: 1.0 };
    case 'button':
      return { label: null, scale: 1.5 };
    default:
      return { label: null, scale: 1.0 };
  }
}
