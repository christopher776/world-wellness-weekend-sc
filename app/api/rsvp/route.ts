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
  const notifyTo = process.env.RSVP_NOTIFY_EMAIL;

  if (resendApiKey && notifyTo) {
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
          from: "World Wellness Weekend <onboarding@resend.dev>",
          to: [notifyTo],
          reply_to: body.email,
          subject,
          text: lines.join("\n"),
        }),
      });
    } catch (err) {
      console.error("RSVP notification email failed:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
