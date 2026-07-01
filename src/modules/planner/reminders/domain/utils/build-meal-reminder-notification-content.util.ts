export function buildMealReminderNotificationContent(params: {
  mealTypeName: string;
  offsetMinutes: number;
  recipeTitles: readonly string[];
  expressNote: string | null;
  isExpress: boolean;
}): { title: string; body: string } {
  const title =
    params.offsetMinutes === 0
      ? `Es hora de tu ${params.mealTypeName.toLowerCase()}`
      : `Prepara tu ${params.mealTypeName.toLowerCase()}`;

  if (params.isExpress && params.expressNote) {
    return {
      title,
      body: params.expressNote,
    };
  }

  if (params.recipeTitles.length > 0) {
    const recipeSummary = params.recipeTitles.slice(0, 2).join(', ');
    const suffix = params.recipeTitles.length > 2 ? '…' : '';

    if (params.offsetMinutes === 0) {
      return {
        title,
        body: `${recipeSummary}${suffix}`,
      };
    }

    const offsetLabel = formatReminderOffsetLabel(params.offsetMinutes);

    return {
      title,
      body: `${recipeSummary}${suffix} ${offsetLabel}`,
    };
  }

  if (params.offsetMinutes === 0) {
    return {
      title,
      body: 'Tu comida planificada es ahora',
    };
  }

  return {
    title,
    body: formatReminderOffsetLabel(params.offsetMinutes),
  };
}

function formatReminderOffsetLabel(offsetMinutes: number): string {
  if (offsetMinutes % 60 === 0 && offsetMinutes >= 60) {
    const hours = offsetMinutes / 60;
    return hours === 1 ? 'en 1 h' : `en ${hours} h`;
  }

  return `en ${offsetMinutes} min`;
}
