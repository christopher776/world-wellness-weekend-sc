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

  const mailgunApiKey = process.env.MAILGUN_API_KEY;
  const mailgunDomain = process.env.MAILGUN_DOMAIN || "mg.scwellness.org";
  // Supports a single address or a comma-separated list, e.g.
  // "a@example.com, b@example.com"
  const notifyTo = (process.env.RSVP_NOTIFY_EMAIL ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
  const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  // Optional: GoHighLevel inbound webhook — when configured, form
  // submissions are also forwarded to GHL as a contact/event.
  const ghlWebhookUrl = process.env.GHL_WEBHOOK_URL;

  // Send a real notification email via Mailgun (mg.scwellness.org) to
  // every configured recipient. If not configured yet, we still accept
  // the submission so the form works end-to-end during setup/testing.
  if (mailgunApiKey && notifyTo.length > 0) {
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

      const form = new URLSearchParams();
      form.set("from", `World Wellness Weekend <updates@${mailgunDomain}>`);
      notifyTo.forEach((addr) => form.append("to", addr));
      form.set("h:Reply-To", body.email);
      form.set("subject", subject);
      form.set("text", lines.join("\n"));

      await fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`api:${mailgunApiKey}`).toString(
            "base64"
          )}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: form.toString(),
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

  // If a GoHighLevel inbound webhook is configured, forward the
  // submission so GHL can create/update a contact and trigger workflows.
  if (ghlWebhookUrl) {
    try {
      await fetch(ghlWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error("GoHighLevel webhook failed:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
