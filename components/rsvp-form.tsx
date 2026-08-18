"use client";

import { useState, FormEvent } from "react";
import { Loader2, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { wellnessClasses, vipTicket } from "@/lib/data";
import { PaymentButton } from "@/components/payment-button";

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
    classInterests: [] as string[],
    experienceLevel: "",
    accessibilityNotes: "",
    message: "",
    website: "", // honeypot — must stay empty
  });

  function updateField<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleClassInterest(className: string) {
    setForm((prev) => ({
      ...prev,
      classInterests: prev.classInterests.includes(className)
        ? prev.classInterests.filter((c) => c !== className)
        : [...prev.classInterests, className],
    }));
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
        classInterests: [],
        experienceLevel: "",
        accessibilityNotes: "",
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
      <div className="space-y-8">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-gold-100 bg-white p-10 text-center">
          <CheckCircle className="h-8 w-8 text-gold-600" />
          <p className="font-serif text-xl font-bold text-navy-800">
            You&apos;re on the list!
          </p>
          <p className="text-sm text-navy-600">
            Thanks for reaching out — we&apos;ll be in touch with updates about
            South Carolina Wellness Weekend, including class schedules that match your
            interests.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-2 text-sm font-semibold uppercase tracking-wide text-gold-700 hover:text-gold-600"
          >
            Submit another response
          </button>
        </div>

        {/* Enhancement option — VIP ticket upsell shown after a successful sign-up */}
        <div className="rounded-xl border border-gold-400/40 bg-navy-800 p-8 text-center text-cream-100">
          <Sparkles className="mx-auto mb-3 h-6 w-6 text-gold-400" />
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
            Want the Full Weekend Experience?
          </p>
          <h3 className="mt-2 font-serif text-2xl font-bold">VIP Experience</h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-navy-100">{vipTicket.description}</p>
          <p className="mt-3 font-serif text-3xl font-bold text-gold-400">{vipTicket.price}</p>
          <div className="mx-auto mt-6 max-w-xs">
            <PaymentButton linkId={vipTicket.linkId} label="Reserve Your VIP Ticket" />
          </div>
          <p className="mt-3 text-xs text-navy-300">
            Optional — your RSVP above is already confirmed either way.
          </p>
        </div>
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
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-navy-600">
          Which classes are you interested in?{" "}
          <span className="normal-case text-navy-400">(optional, select any)</span>
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {wellnessClasses.map((c) => {
            const checked = form.classInterests.includes(c);
            return (
              <label
                key={c}
                className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
                  checked
                    ? "border-gold-500 bg-gold-50 text-navy-800"
                    : "border-navy-100 text-navy-600 hover:border-gold-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleClassInterest(c)}
                  className="h-3.5 w-3.5 rounded border-navy-300 text-gold-600 focus:ring-gold-600"
                />
                {c}
              </label>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-600">
            Class Experience Level <span className="normal-case text-navy-400">(optional)</span>
          </label>
          <select
            value={form.experienceLevel}
            onChange={(e) => updateField("experienceLevel", e.target.value)}
            className="w-full rounded-md border border-navy-100 bg-white px-4 py-2.5 text-sm text-navy-800 focus:border-gold-600 focus:outline-none focus:ring-1 focus:ring-gold-600"
          >
            <option value="">Prefer not to say</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Not Sure">Not Sure</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-600">
            Dietary / Accessibility Needs <span className="normal-case text-navy-400">(optional)</span>
          </label>
          <input
            type="text"
            value={form.accessibilityNotes}
            onChange={(e) => updateField("accessibilityNotes", e.target.value)}
            className="w-full rounded-md border border-navy-100 px-4 py-2.5 text-sm text-navy-800 focus:border-gold-600 focus:outline-none focus:ring-1 focus:ring-gold-600"
            placeholder="e.g. mobility considerations, allergies"
          />
        </div>
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
        We&apos;ll only use your info to share South Carolina Wellness Weekend updates —
        no spam, ever.
      </p>
    </form>
  );
}
