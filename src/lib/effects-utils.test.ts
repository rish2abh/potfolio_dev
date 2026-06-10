import { describe, it, expect } from 'vitest';
import {
  typewriter,
  characterScramble,
  calculateBootSchedule,
  getBootScheduleTotalDuration,
  BoundedQueue,
} from './effects-utils';

describe('typewriter', () => {
  it('returns empty string when elapsed is 0', () => {
    expect(typewriter('Hello', 0, 30)).toBe('');
  });

  it('returns full string when elapsed is large enough', () => {
    // 5 chars at 30 chars/sec → need 5/30*1000 = 167ms
    expect(typewriter('Hello', 200, 30)).toBe('Hello');
  });

  it('returns correct prefix at intermediate time', () => {
    // At 100ms with rate 30: floor(100*30/1000) = floor(3) = 3 chars
    expect(typewriter('Hello', 100, 30)).toBe('Hel');
  });

  it('never exceeds string length', () => {
    expect(typewriter('Hi', 10000, 50)).toBe('Hi');
  });

  it('handles empty string', () => {
    expect(typewriter('', 1000, 30)).toBe('');
  });

  it('works with rate of 50 chars/sec', () => {
    // At 60ms with rate 50: floor(60*50/1000) = floor(3) = 3 chars
    expect(typewriter('Testing', 60, 50)).toBe('Tes');
  });
});

describe('characterScramble', () => {
  it('returns target string at progress=1', () => {
    expect(characterScramble('Hello World', 1)).toBe('Hello World');
  });

  it('returns string of same length at any progress', () => {
    const target = 'Testing123';
    expect(characterScramble(target, 0).length).toBe(target.length);
    expect(characterScramble(target, 0.5).length).toBe(target.length);
    expect(characterScramble(target, 0.75).length).toBe(target.length);
  });

  it('returns empty string for empty target', () => {
    expect(characterScramble('', 0.5)).toBe('');
  });

  it('locks in characters from left to right', () => {
    const target = 'ABCDEFGH';
    // At progress 0.5 → 4 chars locked
    const result = characterScramble(target, 0.5);
    expect(result.slice(0, 4)).toBe('ABCD');
    expect(result.length).toBe(8);
  });

  it('returns target when progress exceeds 1', () => {
    expect(characterScramble('test', 1.5)).toBe('test');
  });
});

describe('calculateBootSchedule', () => {
  it('returns empty array for empty messages', () => {
    expect(calculateBootSchedule([])).toEqual([]);
  });

  it('produces schedule within 1500-2000ms for typical messages', () => {
    const messages = [
      'Initializing system...',
      'Loading modules...',
      'Connecting services...',
      'System ready.',
    ];
    const schedule = calculateBootSchedule(messages);
    const total = getBootScheduleTotalDuration(schedule);
    expect(total).toBeGreaterThanOrEqual(1500);
    expect(total).toBeLessThanOrEqual(2000);
  });

  it('handles single message', () => {
    const schedule = calculateBootSchedule(['Hello world']);
    const total = getBootScheduleTotalDuration(schedule);
    expect(total).toBeGreaterThanOrEqual(1500);
    expect(total).toBeLessThanOrEqual(2000);
    expect(schedule.length).toBe(1);
    expect(schedule[0].delay).toBe(0);
  });

  it('each schedule entry has text, delay, and duration', () => {
    const messages = ['First message', 'Second message'];
    const schedule = calculateBootSchedule(messages);
    for (const entry of schedule) {
      expect(entry.text).toBeDefined();
      expect(entry.delay).toBeGreaterThanOrEqual(0);
      expect(entry.duration).toBeGreaterThan(0);
    }
  });

  it('delays are monotonically increasing', () => {
    const messages = ['A short msg', 'Another message here', 'Third one'];
    const schedule = calculateBootSchedule(messages);
    for (let i = 1; i < schedule.length; i++) {
      expect(schedule[i].delay).toBeGreaterThan(schedule[i - 1].delay);
    }
  });
});

describe('BoundedQueue', () => {
  it('stores items up to capacity', () => {
    const queue = new BoundedQueue<number>(3);
    queue.add(1);
    queue.add(2);
    queue.add(3);
    expect(queue.getItems()).toEqual([1, 2, 3]);
    expect(queue.size).toBe(3);
  });

  it('evicts oldest item when capacity is exceeded', () => {
    const queue = new BoundedQueue<number>(3);
    queue.add(1);
    queue.add(2);
    queue.add(3);
    queue.add(4);
    expect(queue.getItems()).toEqual([2, 3, 4]);
    expect(queue.size).toBe(3);
  });

  it('never exceeds capacity with many additions', () => {
    const queue = new BoundedQueue<number>(8);
    for (let i = 0; i < 100; i++) {
      queue.add(i);
    }
    expect(queue.size).toBe(8);
    // Most recent 8 items
    expect(queue.getItems()).toEqual([92, 93, 94, 95, 96, 97, 98, 99]);
  });

  it('works with capacity of 20 (chat messages)', () => {
    const queue = new BoundedQueue<string>(20);
    for (let i = 0; i < 25; i++) {
      queue.add(`msg ${i}`);
    }
    expect(queue.size).toBe(20);
    expect(queue.getItems()[0]).toBe('msg 5');
    expect(queue.getItems()[19]).toBe('msg 24');
  });

  it('throws error for invalid capacity', () => {
    expect(() => new BoundedQueue<number>(0)).toThrow();
    expect(() => new BoundedQueue<number>(-1)).toThrow();
  });

  it('clear removes all items', () => {
    const queue = new BoundedQueue<number>(5);
    queue.add(1);
    queue.add(2);
    queue.clear();
    expect(queue.size).toBe(0);
    expect(queue.getItems()).toEqual([]);
  });

  it('getCapacity returns correct value', () => {
    const queue = new BoundedQueue<number>(8);
    expect(queue.getCapacity()).toBe(8);
  });

  it('getItems returns a copy, not a reference', () => {
    const queue = new BoundedQueue<number>(5);
    queue.add(1);
    const items = queue.getItems();
    items.push(999);
    expect(queue.size).toBe(1);
  });
});
