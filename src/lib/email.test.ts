import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSend = vi.hoisted(() => vi.fn());

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: mockSend },
  })),
}));

import { sendEmail } from './email';

describe('sendEmail', () => {
  beforeEach(() => {
    mockSend.mockReset();
    mockSend.mockResolvedValue({ id: 'test-id' });
  });

  it('sends an email with structured contact form data', async () => {
    await sendEmail({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello, I would like to connect!',
    });

    expect(mockSend).toHaveBeenCalledOnce();
    const callArgs = mockSend.mock.calls[0][0];

    expect(callArgs.to).toBeDefined();
    expect(callArgs.subject).toBe('Portfolio Contact: John Doe');
    expect(callArgs.replyTo).toBe('john@example.com');
    expect(callArgs.html).toContain('John Doe');
    expect(callArgs.html).toContain('john@example.com');
    expect(callArgs.html).toContain('Hello, I would like to connect!');
  });

  it('escapes HTML in user input to prevent XSS', async () => {
    await sendEmail({
      name: '<script>alert("xss")</script>',
      email: 'attacker@evil.com',
      message: '<img src=x onerror=alert(1)>',
    });

    const callArgs = mockSend.mock.calls[0][0];

    expect(callArgs.html).not.toContain('<script>');
    expect(callArgs.html).not.toContain('<img src=x');
    expect(callArgs.html).toContain('&lt;script&gt;');
    expect(callArgs.html).toContain('&lt;img src=x');
  });

  it('throws when Resend SDK fails', async () => {
    mockSend.mockRejectedValue(new Error('API key invalid'));

    await expect(
      sendEmail({
        name: 'Jane',
        email: 'jane@test.com',
        message: 'Test message here',
      })
    ).rejects.toThrow('API key invalid');
  });
});
