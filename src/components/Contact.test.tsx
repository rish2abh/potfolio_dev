import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import Contact from './Contact';

vi.mock('./SectionWrapper', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: Record<string, unknown>) => <div {...props}>{children}</div>,
  },
  useInView: () => true,
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Contact', () => {
  it('renders the section with id="contact"', () => {
    const { container } = render(<Contact />);
    const section = container.querySelector('#contact');
    expect(section).not.toBeNull();
  });

  it('renders the heading', () => {
    render(<Contact />);
    expect(screen.getByText('Get In Touch')).toBeDefined();
  });

  it('renders name, email, and message fields', () => {
    render(<Contact />);
    expect(screen.getByLabelText('Name')).toBeDefined();
    expect(screen.getByLabelText('Email')).toBeDefined();
    expect(screen.getByLabelText('Message')).toBeDefined();
  });

  it('renders the submit button', () => {
    render(<Contact />);
    expect(screen.getByText('Send Message')).toBeDefined();
  });

  it('renders LinkedIn and GitHub alternative contact links', () => {
    render(<Contact />);
    const linkedinLink = screen.getByText('LinkedIn') as HTMLAnchorElement;
    const githubLink = screen.getByText('GitHub') as HTMLAnchorElement;
    expect(linkedinLink.getAttribute('href')).toContain('linkedin.com');
    expect(githubLink.getAttribute('href')).toContain('github.com');
  });

  it('shows validation errors when submitting empty form', async () => {
    render(<Contact />);
    const submitButton = screen.getByText('Send Message');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeDefined();
      expect(screen.getByText('A valid email is required')).toBeDefined();
      expect(screen.getByText('Message must be at least 10 characters')).toBeDefined();
    });
  });

  it('shows validation error for invalid email', async () => {
    render(<Contact />);

    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const messageInput = screen.getByLabelText('Message');

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(messageInput, { target: { value: 'This is a valid message' } });

    const submitButton = screen.getByText('Send Message');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('A valid email is required')).toBeDefined();
    });
  });

  it('shows validation error for short message', async () => {
    render(<Contact />);

    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const messageInput = screen.getByLabelText('Message');

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@email.com' } });
    fireEvent.change(messageInput, { target: { value: 'Short' } });

    const submitButton = screen.getByText('Send Message');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Message must be at least 10 characters')).toBeDefined();
    });
  });

  it('disables submit button during processing', async () => {
    global.fetch = vi.fn().mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'Sent' }),
      }), 100))
    );

    render(<Contact />);

    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const messageInput = screen.getByLabelText('Message');

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@email.com' } });
    fireEvent.change(messageInput, { target: { value: 'This is a valid message for testing' } });

    const submitButton = screen.getByText('Send Message');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Sending...')).toBeDefined();
      const button = screen.getByText('Sending...') as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });
  });

  it('shows success message and clears form on successful submission', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, message: 'Message sent' }),
    });

    render(<Contact />);

    const nameInput = screen.getByLabelText('Name') as HTMLInputElement;
    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const messageInput = screen.getByLabelText('Message') as HTMLTextAreaElement;

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@email.com' } });
    fireEvent.change(messageInput, { target: { value: 'This is a valid message for testing' } });

    const submitButton = screen.getByText('Send Message');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Message sent successfully/)).toBeDefined();
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(messageInput.value).toBe('');
    });
  });

  it('shows error message and preserves form data on failure', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    render(<Contact />);

    const nameInput = screen.getByLabelText('Name') as HTMLInputElement;
    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const messageInput = screen.getByLabelText('Message') as HTMLTextAreaElement;

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@email.com' } });
    fireEvent.change(messageInput, { target: { value: 'This is a valid message for testing' } });

    const submitButton = screen.getByText('Send Message');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Unable to send message. Please try again.')).toBeDefined();
      expect(nameInput.value).toBe('Test User');
      expect(emailInput.value).toBe('test@email.com');
      expect(messageInput.value).toBe('This is a valid message for testing');
    });
  });

  it('shows error message from API response on non-ok response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ success: false, message: 'Something went wrong. Please try again later.' }),
    });

    render(<Contact />);

    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const messageInput = screen.getByLabelText('Message');

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@email.com' } });
    fireEvent.change(messageInput, { target: { value: 'This is a valid message for testing' } });

    const submitButton = screen.getByText('Send Message');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Something went wrong. Please try again later.')).toBeDefined();
    });
  });

  it('clears field-level error when user starts typing', async () => {
    render(<Contact />);

    const submitButton = screen.getByText('Send Message');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeDefined();
    });

    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'J' } });

    await waitFor(() => {
      expect(screen.queryByText('Name is required')).toBeNull();
    });
  });
});
