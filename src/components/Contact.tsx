'use client';

import { useState, FormEvent } from 'react';
import SectionWrapper from './SectionWrapper';
import Button from './ui/Button';
import { personalInfo } from '@/data/personal';
import { validateContactForm } from '@/lib/validators';
import { ContactFormData, ContactFormErrors } from '@/types';

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name as keyof ContactFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const validationErrors = validateContactForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage('Message sent successfully! I will get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setErrorMessage(
          data.message || 'Something went wrong. Please try again later.'
        );
      }
    } catch {
      setErrorMessage('Unable to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-4">
      <SectionWrapper sectionId="contact">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            Let&apos;s Build Something
          </h2>
          <p className="text-gray-300 text-center text-lg mb-10 max-w-xl mx-auto">
            I&apos;m open to backend roles, contract work, and engineering challenges that need someone who ships reliable systems. If that sounds like what you need — let&apos;s talk.
          </p>

          {successMessage && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-center"
            >
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-center"
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div>
              <label
                htmlFor="contact-name"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="contact-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                maxLength={100}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue/50 transition-colors"
                placeholder="Your name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="contact-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                maxLength={254}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue/50 transition-colors"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                maxLength={1000}
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue/50 transition-colors resize-none"
                placeholder="Your message (minimum 10 characters)"
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-400" role="alert">
                  {errors.message}
                </p>
              )}
            </div>

            <div className="text-center">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className={isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">Or reach out directly:</p>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="secondary"
                href={personalInfo.linkedin}
              >
                LinkedIn
              </Button>
              <Button
                variant="outline"
                href={personalInfo.github}
              >
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </section>
  );
}
