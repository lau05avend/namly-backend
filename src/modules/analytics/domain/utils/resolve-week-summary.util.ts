import type { RhythmWeekSummaryEntity } from '../entities/rhythm-week-summary.entity';

export function resolveWeekSummary(averageCompletion: number): RhythmWeekSummaryEntity {
  if (averageCompletion >= 75) {
    return {
      level: 'stable',
      tone: 'positive',
      message: 'Tu ritmo ha sido muy estable esta semana',
    };
  }

  if (averageCompletion >= 50) {
    return {
      level: 'active',
      tone: 'positive',
      message: 'Has mantenido un ritmo activo esta semana',
    };
  }

  if (averageCompletion >= 25) {
    return {
      level: 'irregular',
      tone: 'neutral',
      message: 'Tu ritmo cambió durante la semana, y eso también cuenta',
    };
  }

  return {
    level: 'quiet',
    tone: 'neutral',
    message: 'Algunas semanas son más tranquilas que otras',
  };
}
