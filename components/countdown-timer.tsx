"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function computeTimeLeft(targetMs: number): TimeLeft {
  const diff = targetMs - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: false,
  };
}

interface CountdownTimerProps {
  /** ISO 8601 date-time string, including the Eastern Time offset (e.g. "2026-09-18T08:00:00-04:00"). */
  targetDate: string;
  label?: string;
  doneLabel?: string;
  /** "dark" for use on navy backgrounds, "light" for use on cream/white backgrounds. */
  theme?: "dark" | "light";
}

/**
 * Client-only countdown — ticks every second toward `targetDate`. Renders a
 * fixed-height placeholder until mounted so the server-rendered markup never
 * contains a "frozen" timestamp that would mismatch the client's clock on
 * hydration (which Next.js would otherwise warn about / briefly flash).
 */
export function CountdownTimer({
  targetDate,
  label,
  doneLabel = "The weekend has begun!",
  theme = "dark",
}: CountdownTimerProps) {
  const targetMs = new Date(targetDate).getTime();
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    function tick() {
      setTime(computeTimeLeft(targetMs));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  const boxClass =
    theme === "dark"
      ? "bg-navy-900/60 text-gold-400 ring-1 ring-gold-400/20"
      : "bg-white text-navy-800 ring-1 ring-gold-200 shadow-sm";
  const captionClass = theme === "dark" ? "text-navy-200" : "text-navy-400";
  const labelClass = theme === "dark" ? "text-gold-400" : "text-gold-700";

  if (!time) {
    return <div className="h-[72px]" aria-hidden="true" />;
  }

  if (time.done) {
    return <p className={`font-serif text-lg font-bold ${labelClass}`}>{doneLabel}</p>;
  }

  const units: { value: number; unit: string }[] = [
    { value: time.days, unit: "Days" },
    { value: time.hours, unit: "Hrs" },
    { value: time.minutes, unit: "Min" },
    { value: time.seconds, unit: "Sec" },
  ];

  return (
    <div>
      {label && (
        <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.2em] ${labelClass}`}>
          {label}
        </p>
      )}
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {units.map((u) => (
          <div
            key={u.unit}
            className={`flex min-w-[60px] flex-col items-center rounded-lg px-3 py-2 ${boxClass}`}
          >
            <span className="font-serif text-2xl font-bold tabular-nums sm:text-3xl">
              {String(u.value).padStart(2, "0")}
            </span>
            <span className={`text-[10px] uppercase tracking-wide ${captionClass}`}>
              {u.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
