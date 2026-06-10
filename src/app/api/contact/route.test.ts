import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSendEmail = vi.hoisted(() => vi.fn());

vi.mock('@/lib/email', () => ({
  sendEmail: mockSendEmail,
}));

import { POST } from './route';

function createRequest(body: unknown): Request {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    mockSendEmail.mockReset();
    mockSendEmail.mockResolvedValue(undefined);
  });

  it('returns 200 with success message on valid submission', async () => {
    const request = createRequest({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello, this is a valid message!',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Message sent successfully');
    expect(mockSendEmail).toHaveBeenCalledOnce();
  });

  it('returns 400 with validation errors when name is empty', async () => {
    const request = createRequest({
      name: '',
      email: 'john@example.com',
      message: 'Hello, this is a valid message!',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.message).toBe('Validation failed');
    expect(data.errors.name).toBeDefined();
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it('returns 400 with validation errors when email is invalid', async () => {
    const request = createRequest({
      name: 'John Doe',
      email: 'invalid-email',
      message: 'Hello, this is a valid message!',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.errors.email).toBeDefined();
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it('returns 400 with validation errors when message is too short', async () => {
    const request = createRequest({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Short',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.errors.message).toBeDefined();
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it('returns 400 with multiple validation errors', async () => {
    const request = createRequest({
      name: '   ',
      email: '',
      message: '',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.errors.name).toBeDefined();
    expect(data.errors.email).toBeDefined();
    expect(data.errors.message).toBeDefined();
  });

  it('returns 500 when sendEmail throws an error', async () => {
    mockSendEmail.mockRejectedValue(new Error('Resend API failure'));

    const request = createRequest({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello, this is a valid message!',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.message).toBe('Failed to send message');
  });

  it('returns 500 when request body is invalid JSON', async () => {
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not valid json',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.message).toBe('Failed to send message');
  });

  it('calls sendEmail with the form data on valid submission', async () => {
    const formData = {
      name: 'Jane Smith',
      email: 'jane@company.org',
      message: 'I would like to discuss a potential collaboration.',
    };

    const request = createRequest(formData);
    await POST(request);

    expect(mockSendEmail).toHaveBeenCalledWith(formData);
  });
});
