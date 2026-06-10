import { Resend } from 'resend';
import { ContactFormData } from '@/types';

/**
 * Sends a structured email with contact form data using the Resend SDK.
 * Reads API key from RESEND_API_KEY environment variable.
 */
export async function sendEmail(data: ContactFormData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey === 'your_resend_api_key_here') {
    throw new Error(
      'RESEND_API_KEY is not configured. Add it to your .env.local file.'
    );
  }

  const resend = new Resend(apiKey);
  const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || 'delivered@resend.dev';
  const { name, email, message } = data;

  const { error } = await resend.emails.send({
    from: 'Portfolio Contact <onboarding@resend.dev>',
    to: recipientEmail,
    subject: `Portfolio Contact: ${name}`,
    replyTo: email,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <hr style="border: 1px solid #eee;" />
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <h3 style="color: #555;">Message:</h3>
        <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
        <hr style="border: 1px solid #eee;" />
        <p style="color: #999; font-size: 12px;">Sent from portfolio contact form</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Resend API error: ${error.message}`);
  }
}

/**
 * Escapes HTML special characters to prevent XSS in email content.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
