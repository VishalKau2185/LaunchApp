/**
 * Dev simulation date helpers — no "use server", safe to import anywhere.
 * The cookie is read server-side by the pages that need it.
 */

export const DEV_OFFSET_COOKIE = "dev_day_offset"

export function getSimulatedDate(offsetDays: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().split("T")[0]
}
