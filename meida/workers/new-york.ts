export type NewYorkClock = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: number;
  date: string;
  monthKey: string;
};

const weekdays: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

export function newYorkClock(timestamp = Date.now()): NewYorkClock {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    weekday: "short",
  }).formatToParts(timestamp);
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  const year = Number(values.year);
  const month = Number(values.month);
  const day = Number(values.day);
  return {
    year,
    month,
    day,
    hour: Number(values.hour),
    minute: Number(values.minute),
    weekday: weekdays[values.weekday] ?? 0,
    date: `${values.year}-${values.month}-${values.day}`,
    monthKey: `${values.year}-${values.month}`,
  };
}

export function sameNewYorkHour(left: number | null, right: number): boolean {
  if (!left) return false;
  const leftClock = newYorkClock(left);
  const rightClock = newYorkClock(right);
  return leftClock.date === rightClock.date && leftClock.hour === rightClock.hour;
}

export function preferredProviderSlots(provider: "tavily" | "exa" | "firecrawl", timestamp = Date.now()): number[] {
  const weekday = newYorkClock(timestamp).weekday;
  const tavilySlot: Record<number, number> = { 0: 3, 1: 1, 2: 2, 3: 1, 4: 2, 5: 1, 6: 3 };
  const rotatingSlot: Record<number, number> = { 0: 3, 1: 1, 2: 2, 3: 3, 4: 1, 5: 2, 6: 3 };
  if (provider === "tavily" && weekday === 6) return [];
  const first = provider === "tavily" ? tavilySlot[weekday] : rotatingSlot[weekday];
  return [first, ...[1, 2, 3].filter(slot => slot !== first)];
}
