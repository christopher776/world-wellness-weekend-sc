import { NextResponse } from "next/server";

export interface RsvpPayload {
  type: "rsvp" | "newsletter";
  name?: string;
  email: string;
  phone?: string;
  organization?: string;
  interest?: string;
  message?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: RsvpPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (!body.email || !isValidEmail(body.email)) {
    return NextResponse.json(
      { ok: false, error: "A valid email address is required." },
      { status: 400 }
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  // Supports a single address or a comma-separated list, e.g.
  // "a@example.com, b@example.com, c@example.com"
  const notifyTo = (process.env.RSVP_NOTIFY_EMAIL ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
  const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  // If Resend is configured (via Vercel environment variables), send a
  // real notification email to every configured recipient. If not
  // configured yet, we still accept the submission so the form works
  // end-to-end during setup/testing.
  if (resendApiKey && notifyTo.length > 0) {
    try {
      const subject =
        body.type === "newsletter"
          ? `New newsletter signup: ${body.email}`
          : `New RSVP: ${body.name ?? body.email}`;

      const lines = [
        `Type: ${body.type}`,
        `Name: ${body.name ?? "-"}`,
        `Email: ${body.email}`,
        `Phone: ${body.phone ?? "-"}`,
        `Organization: ${body.organization ?? "-"}`,
        `Interest: ${body.interest ?? "-"}`,
        `Message: ${body.message ?? "-"}`,
      ];

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "World Wellness Weekend <updates@scwellness.org>",
          to: notifyTo,
          reply_to: body.email,
          subject,
          text: lines.join("\n"),
        }),
      });
    } catch (err) {
      // Do not fail the user-facing submission if the email send fails —
      // log it server-side for later investigation.
      console.error("RSVP notification email failed:", err);
    }
  }

  // If a Google Sheets Apps Script webhook is configured, append the
  // submission as a row for storage/record-keeping.
  if (sheetsWebhookUrl) {
    try {
      await fetch(sheetsWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        redirect: "follow",
      });
    } catch (err) {
      console.error("Google Sheets webhook failed:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
