export function resolveGrowthStageId(currentDays: number): number {
  if (currentDays <= 0) {
    return 1;
  }

  if (currentDays <= 2) {
    return 2;
  }

  if (currentDays <= 6) {
    return 3;
  }

  if (currentDays <= 13) {
    return 4;
  }

  return 5;
}
