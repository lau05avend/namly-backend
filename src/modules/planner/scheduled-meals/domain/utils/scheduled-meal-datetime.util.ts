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

  return new Date(year, month - 1, day, hours, minutes, seconds, 0);
}

export function formatFloatingLocalEntryDate(instant: Date): string {
  return getFloatingLocalNowParts(instant).entryDate;
}

export function getLocalEntryDateDayRange(entryDate: string): { start: Date; end: Date } {
  const start = parseLocalEntryDate(entryDate);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
}

export function getFloatingLocalNowParts(now: Date = new Date()): {
  entryDate: string;
  plannedTime: string;
} {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return {
    entryDate: `${year}-${month}-${day}`,
    plannedTime: `${hours}:${minutes}:${seconds}`,
  };
}

export function formatTimeToLocalString(loggedAt: Date): string {
  return loggedAt.toLocaleTimeString('es-CO', {
    timeZone: 'America/Bogota', // TODO: Ajusta a hora Colombia, recibir esto como parámetro
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
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
