/** Wall-clock timezone for planner entry dates and planned times (Colombia). */
export const APP_FLOATING_TIMEZONE = 'America/Bogota';

type ZonedDateParts = {
  readonly year: number;
  readonly month: number;
  readonly day: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
};

function getZonedDateParts(
  instant: Date,
  timeZone: string = APP_FLOATING_TIMEZONE,
): ZonedDateParts {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });

  const parts = formatter.formatToParts(instant);
  const read = (type: Intl.DateTimeFormatPartTypes): number =>
    Number(parts.find((part) => part.type === type)?.value ?? '0');

  return {
    year: read('year'),
    month: read('month'),
    day: read('day'),
    hours: read('hour'),
    minutes: read('minute'),
    seconds: read('second'),
  };
}

function zonedWallClockToUtc(
  year: number,
  month: number,
  day: number,
  hours: number,
  minutes: number,
  seconds: number,
  timeZone: string = APP_FLOATING_TIMEZONE,
): Date {
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
  const zoned = getZonedDateParts(utcGuess, timeZone);
  const desiredAsUtc = Date.UTC(year, month - 1, day, hours, minutes, seconds);
  const actualAsUtc = Date.UTC(
    zoned.year,
    zoned.month - 1,
    zoned.day,
    zoned.hours,
    zoned.minutes,
    zoned.seconds,
  );

  return new Date(utcGuess.getTime() + (desiredAsUtc - actualAsUtc));
}

export function parseEntryDate(dateStr: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);

  if (!match) {
    throw new Error('Invalid entry date format');
  }

  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
}

export function parseLocalEntryDate(loggedAtStr: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(loggedAtStr);
  if (!match) {
    throw new Error('Invalid logged at format');
  }
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function parsePlannedTime(timeStr: string): Date {
  const parts = timeStr.split(':');
  const hours = Number(parts[0]);
  const minutes = Number(parts[1] ?? 0);
  const seconds = Number(parts[2] ?? 0);

  return new Date(Date.UTC(1970, 0, 1, hours, minutes, seconds));
}

export function formatEntryDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formatPlannedTime(time: Date): string {
  const hours = time.getUTCHours().toString().padStart(2, '0');
  const minutes = time.getUTCMinutes().toString().padStart(2, '0');
  const seconds = time.getUTCSeconds().toString().padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

export function normalizePlannedTime(timeStr: string): string {
  const parts = timeStr.split(':');
  const hours = String(Number(parts[0])).padStart(2, '0');
  const minutes = String(Number(parts[1] ?? 0)).padStart(2, '0');
  const seconds = String(Number(parts[2] ?? 0)).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

export function comparePlannedMoments(
  entryDateA: string,
  plannedTimeA: string,
  entryDateB: string,
  plannedTimeB: string,
): number {
  const dateCompare = entryDateA.localeCompare(entryDateB);

  if (dateCompare !== 0) {
    return dateCompare;
  }

  return normalizePlannedTime(plannedTimeA).localeCompare(normalizePlannedTime(plannedTimeB));
}

export function toPlannedInstant(entryDate: Date, plannedTime: Date): Date {
  const dateStr = formatEntryDate(entryDate);
  const timeStr = formatPlannedTime(plannedTime);
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);

  return zonedWallClockToUtc(year, month, day, hours, minutes, seconds);
}

export function formatFloatingLocalEntryDate(instant: Date): string {
  return getFloatingLocalNowParts(instant).entryDate;
}

export function getLocalEntryDateDayRange(entryDate: string): { start: Date; end: Date } {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(entryDate);

  if (!match) {
    throw new Error('Invalid entry date format');
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const start = zonedWallClockToUtc(year, month, day, 0, 0, 0);
  const nextDay = new Date(Date.UTC(year, month - 1, day + 1));
  const end = zonedWallClockToUtc(
    nextDay.getUTCFullYear(),
    nextDay.getUTCMonth() + 1,
    nextDay.getUTCDate(),
    0,
    0,
    0,
  );

  return { start, end };
}

export function getFloatingLocalNowParts(now: Date = new Date()): {
  entryDate: string;
  plannedTime: string;
} {
  const parts = getZonedDateParts(now);
  const month = String(parts.month).padStart(2, '0');
  const day = String(parts.day).padStart(2, '0');
  const hours = String(parts.hours).padStart(2, '0');
  const minutes = String(parts.minutes).padStart(2, '0');
  const seconds = String(parts.seconds).padStart(2, '0');

  return {
    entryDate: `${parts.year}-${month}-${day}`,
    plannedTime: `${hours}:${minutes}:${seconds}`,
  };
}

const displayTimeOptions: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
};

export function formatTimeToLocalString(loggedAt: Date): string {
  return loggedAt.toLocaleTimeString('es-CO', {
    timeZone: APP_FLOATING_TIMEZONE,
    ...displayTimeOptions,
  });
}

// TODO: mirar con history calendar sí reusar esta función
export function parseMonthParam(month: string): { year: number; month: number } {
  const match = /^(\d{4})-(\d{2})$/.exec(month);

  if (!match) {
    throw new Error('Invalid month format');
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
  };
}

export function getMonthDateRange(year: number, month: number): { start: Date; end: Date } {
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 0));

  return { start, end };
}
