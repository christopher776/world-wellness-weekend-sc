"use client";

import { useState, FormEvent } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

export function RsvpForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    interest: "General Updates",
    message: "",
    website: "", // honeypot — must stay empty
  });

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "rsvp", ...form }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      setForm({
        name: "",
        email: "",
        phone: "",
        organization: "",
        interest: "General Updates",
        message: "",
        website: "",
      });
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-gold-100 bg-white p-10 text-center">
        <CheckCircle className="h-8 w-8 text-gold-600" />
        <p className="font-serif text-xl font-bold text-navy-800">
          You&apos;re on the list!
        </p>
        <p className="text-sm text-navy-600">
          Thanks for reaching out — we&apos;ll be in touch with updates about
          World Wellness Weekend, South Carolina.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm font-semibold uppercase tracking-wide text-gold-700 hover:text-gold-600"
        >
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-navy-100 bg-white p-8 shadow-sm"
    >
      {/* Honeypot field — hidden from real visitors via off-screen
          positioning (not display:none, which some bots detect and
          skip). Left blank by humans; bots that auto-fill every field
          will trip it. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden"
      >
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => updateField("website", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-600">
            Name
          </label>
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="w-full rounded-md border border-navy-100 px-4 py-2.5 text-sm text-navy-800 focus:border-gold-600 focus:outline-none focus:ring-1 focus:ring-gold-600"
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-600">
            Email
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="w-full rounded-md border border-navy-100 px-4 py-2.5 text-sm text-navy-800 focus:border-gold-600 focus:outline-none focus:ring-1 focus:ring-gold-600"
            placeholder="jane@example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-600">
            Phone <span className="normal-case text-navy-400">(optional)</span>
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className="w-full rounded-md border border-navy-100 px-4 py-2.5 text-sm text-navy-800 focus:border-gold-600 focus:outline-none focus:ring-1 focus:ring-gold-600"
            placeholder="(843) 555-0100"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-600">
            Organization <span className="normal-case text-navy-400">(optional)</span>
          </label>
          <input
            type="text"
            value={form.organization}
            onChange={(e) => updateField("organization", e.target.value)}
            className="w-full rounded-md border border-navy-100 px-4 py-2.5 text-sm text-navy-800 focus:border-gold-600 focus:outline-none focus:ring-1 focus:ring-gold-600"
            placeholder="Your business or studio"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-600">
          I&apos;m interested in
        </label>
        <select
          value={form.interest}
          onChange={(e) => updateField("interest", e.target.value)}
          className="w-full rounded-md border border-navy-100 bg-white px-4 py-2.5 text-sm text-navy-800 focus:border-gold-600 focus:outline-none focus:ring-1 focus:ring-gold-600"
        >
          <option>General Updates</option>
          <option>Sponsorship &amp; Exhibitor Opportunities</option>
          <option>Room Rentals</option>
          <option>Teaching a Wellness Class</option>
          <option>VIP Rest &amp; Restore Lounge</option>
          <option>SC Spa &amp; Wellness Association Membership</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-600">
          Message <span className="normal-case text-navy-400">(optional)</span>
        </label>
        <textarea
          value={form.message}
          onChange={(e) => updateField("message", e.target.value)}
          rows={4}
          className="w-full rounded-md border border-navy-100 px-4 py-2.5 text-sm text-navy-800 focus:border-gold-600 focus:outline-none focus:ring-1 focus:ring-gold-600"
          placeholder="Tell us anything else we should know..."
        />
      </div>

      {status === "error" && (
        <div className="flex items-start gap-2 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-navy-800 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-cream-100 transition-colors hover:bg-navy-600 disabled:opacity-60"
      >
        {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" />}
        {status === "submitting" ? "Sending..." : "Sign Up for Updates"}
      </button>

      <p className="text-center text-xs text-navy-400">
        We&apos;ll only use your info to share World Wellness Weekend updates —
        no spam, ever.
      </p>
    </form>
  );
}
