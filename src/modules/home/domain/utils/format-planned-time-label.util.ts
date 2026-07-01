import { normalizePlannedTime } from '@modules/planner/scheduled-meals/domain/utils/scheduled-meal-datetime.util';

export function formatPlannedTimeLabel(plannedTime: string): string {
  const normalized = normalizePlannedTime(plannedTime);
  const [hours, minutes] = normalized.split(':').map(Number);
  const localTime = new Date(1970, 0, 1, hours, minutes, 0);

  return localTime.toLocaleTimeString('es-CO', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
