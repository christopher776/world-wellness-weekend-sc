/**
 * All event dates/times entered in the admin panel represent Eastern Time
 * (Charleston, SC — the event's actual local time) as plain wall-clock
 * values, with no timezone metadata attached (e.g. a date field stores
 * "2026-09-18", a time field stores "9:00 AM").
 *
 * These helpers must format that as a friendly Eastern-labeled string
 * WITHOUT ever parsing through `new Date("2026-09-18")` (which JS treats as
 * UTC midnight and can print as the *previous* day once formatted in a
 * non-UTC context) and without ever surfacing "GMT"/"UTC" in the output.
 */

/**
 * Formats a "YYYY-MM-DD" admin date field as "Friday, September 18, 2026".
 * Falls back to the raw string if it isn't in that shape (e.g. "TBD").
 */
export function formatEventDate(dateStr: string | undefined | null): string {
  if (!dateStr) return "";
  const match = dateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return dateStr;

  const [, y, m, d] = match;
  // Construct the Date from explicit local Y/M/D components (not by parsing
  // the ISO string) so no UTC<->local conversion — and therefore no
  // off-by-one-day risk — ever occurs.
  const date = new Date(Number(y), Number(m) - 1, Number(d));

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Appends an explicit "ET" (Eastern Time) label to a plain time string
 * already entered in the admin panel (e.g. "9:00 AM" -> "9:00 AM ET").
 * Never touches GMT/UTC — the input is already the correct local Charleston
 * wall-clock time, this only makes the timezone explicit for readers.
 */
export function formatEventTime(timeStr: string | undefined | null): string {
  if (!timeStr) return "";
  const trimmed = timeStr.trim();
  if (!trimmed) return "";
  if (/\bET\b/i.test(trimmed)) return trimmed;
  return `${trimmed} ET`;
}

/**
 * Formats a start/end time pair as "9:00 AM–10:30 AM ET" (single trailing
 * "ET" label rather than repeating it for both times).
 */
export function formatEventTimeRange(
  startTime: string | undefined | null,
  endTime: string | undefined | null
): string {
  const start = startTime?.trim();
  const end = endTime?.trim();
  if (!start && !end) return "";
  const range = end ? `${start ?? ""}–${end}` : start ?? "";
  return `${range} ET`;
}
