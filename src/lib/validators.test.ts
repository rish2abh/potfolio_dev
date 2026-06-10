import { describe, it, expect } from 'vitest';
import { validateContactForm } from './validators';

describe('validateContactForm', () => {
  it('returns empty errors object when all fields are valid', () => {
    const result = validateContactForm({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello, this is a valid message.',
    });
    expect(result).toEqual({});
  });

  it('returns name error when name is empty', () => {
    const result = validateContactForm({
      name: '',
      email: 'john@example.com',
      message: 'Hello, this is a valid message.',
    });
    expect(result.name).toBeDefined();
  });

  it('returns name error when name is only whitespace', () => {
    const result = validateContactForm({
      name: '   \t\n  ',
      email: 'john@example.com',
      message: 'Hello, this is a valid message.',
    });
    expect(result.name).toBeDefined();
  });

  it('returns email error when email is empty', () => {
    const result = validateContactForm({
      name: 'John',
      email: '',
      message: 'Hello, this is a valid message.',
    });
    expect(result.email).toBeDefined();
  });

  it('returns email error when email has no @ symbol', () => {
    const result = validateContactForm({
      name: 'John',
      email: 'invalid-email',
      message: 'Hello, this is a valid message.',
    });
    expect(result.email).toBeDefined();
  });

  it('returns email error when email has no domain TLD', () => {
    const result = validateContactForm({
      name: 'John',
      email: 'user@domain',
      message: 'Hello, this is a valid message.',
    });
    expect(result.email).toBeDefined();
  });

  it('returns message error when message is empty', () => {
    const result = validateContactForm({
      name: 'John',
      email: 'john@example.com',
      message: '',
    });
    expect(result.message).toBeDefined();
  });

  it('returns message error when message is fewer than 10 characters', () => {
    const result = validateContactForm({
      name: 'John',
      email: 'john@example.com',
      message: 'Short',
    });
    expect(result.message).toBeDefined();
  });

  it('accepts message with exactly 10 characters', () => {
    const result = validateContactForm({
      name: 'John',
      email: 'john@example.com',
      message: '1234567890',
    });
    expect(result.message).toBeUndefined();
  });

  it('returns multiple errors when multiple fields are invalid', () => {
    const result = validateContactForm({
      name: '',
      email: 'bad',
      message: 'short',
    });
    expect(result.name).toBeDefined();
    expect(result.email).toBeDefined();
    expect(result.message).toBeDefined();
  });

  it('accepts valid name with leading/trailing spaces (not only whitespace)', () => {
    const result = validateContactForm({
      name: '  John  ',
      email: 'john@example.com',
      message: 'Hello, this is valid.',
    });
    expect(result.name).toBeUndefined();
  });
});
