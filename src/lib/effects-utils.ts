/**
 * Core utility functions for the creative effects system.
 * All functions are pure and independently testable.
 */

/**
 * Typewriter effect: returns a prefix of the input string based on elapsed time and typing rate.
 *
 * @param str - The full string to type out
 * @param elapsed - Time elapsed in milliseconds
 * @param rate - Typing speed in characters per second (20-50 range)
 * @returns A prefix substring of `str`
 */
export function typewriter(str: string, elapsed: number, rate: number): string {
  const charsToShow = Math.min(Math.floor((elapsed * rate) / 1000), str.length);
  return str.slice(0, charsToShow);
}

/**
 * Character scramble effect: returns a string of the same length as target,
 * converging to the target as progress approaches 1.
 *
 * At progress=0, all characters are random. At progress=1, output equals target.
 * Characters "lock in" from left to right as progress increases.
 *
 * @param target - The final string to converge toward
 * @param progress - A value between 0 and 1 indicating convergence
 * @returns A string of the same length as target
 */
export function characterScramble(target: string, progress: number): string {
  if (progress >= 1) return target;
  if (target.length === 0) return '';

  const lockedCount = Math.floor(progress * target.length);
  const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';

  let result = '';
  for (let i = 0; i < target.length; i++) {
    if (i < lockedCount) {
      result += target[i];
    } else {
      result += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
    }
  }
  return result;
}

/**
 * Boot schedule calculator: distributes timing across messages so total animation
 * duration falls within 1500-2000ms.
 *
 * Each message's type time is proportional to its character count.
 * Inter-message gaps are distributed evenly across messages.
 *
 * @param messages - Array of message strings to schedule
 * @returns Array of { text, delay } objects where delay is cumulative start time in ms
 */
export function calculateBootSchedule(
  messages: string[]
): { text: string; delay: number; duration: number }[] {
  if (messages.length === 0) return [];

  const TARGET_TOTAL = 1750; // Target midpoint of 1500-2000ms
  const MIN_TOTAL = 1500;
  const MAX_TOTAL = 2000;

  // Calculate total characters for proportional distribution
  const totalChars = messages.reduce((sum, msg) => sum + msg.length, 0);

  // Allocate 70% of time budget to typing, 30% to gaps between messages
  const gapCount = Math.max(messages.length - 1, 0);
  const typingBudget = TARGET_TOTAL * 0.7;
  const gapBudget = TARGET_TOTAL * 0.3;
  const gapPerMessage = gapCount > 0 ? gapBudget / gapCount : 0;

  const schedule: { text: string; delay: number; duration: number }[] = [];
  let cumulativeDelay = 0;

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    // Duration proportional to character count
    const duration = totalChars > 0
      ? (msg.length / totalChars) * typingBudget
      : typingBudget / messages.length;

    schedule.push({
      text: msg,
      delay: cumulativeDelay,
      duration,
    });

    cumulativeDelay += duration + (i < messages.length - 1 ? gapPerMessage : 0);
  }

  // Scale to fit within bounds if needed
  const actualTotal = cumulativeDelay;
  if (actualTotal < MIN_TOTAL || actualTotal > MAX_TOTAL) {
    const scale = TARGET_TOTAL / actualTotal;
    let rescaledDelay = 0;
    for (let i = 0; i < schedule.length; i++) {
      schedule[i].delay = rescaledDelay;
      schedule[i].duration = schedule[i].duration * scale;
      rescaledDelay += schedule[i].duration + (i < schedule.length - 1 ? gapPerMessage * scale : 0);
    }
  }

  return schedule;
}

/**
 * Returns the total animation duration for a boot schedule.
 * This is the delay of the last message plus its duration.
 */
export function getBootScheduleTotalDuration(
  schedule: { text: string; delay: number; duration: number }[]
): number {
  if (schedule.length === 0) return 0;
  const last = schedule[schedule.length - 1];
  return last.delay + last.duration;
}

/**
 * BoundedQueue: a FIFO queue that enforces a maximum capacity.
 * When capacity is exceeded, the oldest items are evicted first.
 *
 * Used for log entries (capacity 8) and chat messages (capacity 20).
 */
export class BoundedQueue<T> {
  private items: T[] = [];
  private readonly capacity: number;

  constructor(capacity: number) {
    if (capacity < 1) {
      throw new Error('BoundedQueue capacity must be at least 1');
    }
    this.capacity = capacity;
  }

  /**
   * Add an item to the queue. If at capacity, the oldest item is evicted.
   */
  add(item: T): void {
    this.items.push(item);
    if (this.items.length > this.capacity) {
      this.items.shift();
    }
  }

  /**
   * Get all items currently in the queue (oldest first).
   */
  getItems(): T[] {
    return [...this.items];
  }

  /**
   * Get the current number of items in the queue.
   */
  get size(): number {
    return this.items.length;
  }

  /**
   * Get the maximum capacity of the queue.
   */
  getCapacity(): number {
    return this.capacity;
  }

  /**
   * Clear all items from the queue.
   */
  clear(): void {
    this.items = [];
  }
}
