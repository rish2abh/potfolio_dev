import { ContactFormData, ContactFormErrors } from '@/types';

/**
 * Validates contact form data and returns an errors object.
 * Returns an empty object when all fields are valid.
 */
export function validateContactForm(data: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {};

  // Name: must not be empty or contain only whitespace
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Name is required';
  }

  // Email: must not be empty and must match local@domain.tld pattern
  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'A valid email is required';
  }

  // Message: must not be empty and must be at least 10 characters
  if (!data.message || data.message.length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }

  return errors;
}

/**
 * Validates email against the pattern: local@domain.tld
 * Requires at least one character before @, at least one character for domain,
 * a dot separator, and at least one character for the TLD.
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
