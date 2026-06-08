export function resolveAffectedEntryDates(
  entryDate: string,
  previousEntryDate?: string,
): readonly string[] {
  if (previousEntryDate && previousEntryDate !== entryDate) {
    return previousEntryDate < entryDate
      ? [previousEntryDate, entryDate]
      : [entryDate, previousEntryDate];
  }

  return [entryDate];
}
