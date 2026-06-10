import { validateContactForm } from '@/lib/validators';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const errors = validateContactForm(body);

    if (Object.keys(errors).length > 0) {
      return Response.json(
        { success: false, message: 'Validation failed', errors },
        { status: 400 }
      );
    }

    await sendEmail(body);
    return Response.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact API error:', error);
    const message =
      error instanceof Error && error.message.includes('RESEND_API_KEY')
        ? 'Email service is not configured. Please contact the site owner.'
        : 'Failed to send message. Please try again later.';
    return Response.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
