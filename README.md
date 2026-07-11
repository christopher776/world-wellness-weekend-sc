# World Wellness Weekend — South Carolina

Official website for World Wellness Weekend, South Carolina (Charleston, SC — September 18–19, 2026). Built with Next.js 15, React 19, and Tailwind CSS.

## Pages
- `/` — Home
- `/sponsorship` — Sponsorship & Exhibitor tiers (Founding Partner, Gold, Platinum, Diamond, VIP Lounge) with Authorize.Net payment buttons
- `/rentals` — Treatment Room & Business Room rentals
- `/hotel-travel` — Host hotel & Charleston info
- `/association` — South Carolina Spa & Wellness Association
- `/rsvp` — RSVP / updates signup form

## Local development
```bash
npm install
npm run dev
```

## Environment variables (optional, for RSVP email notifications)
- `RESEND_API_KEY` — Resend API key
- `RSVP_NOTIFY_EMAIL` — email address to receive RSVP/newsletter notifications

## Deployment
Deployed on Vercel. Custom domain: scwellness.org (DNS hosted at Bluehost, pointed to Vercel).
