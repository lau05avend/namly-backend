export function isOnboardingComplete(
  activeQuestionsCount: number,
  answeredQuestionsCount: number,
): boolean {
  return answeredQuestionsCount === activeQuestionsCount;
}
