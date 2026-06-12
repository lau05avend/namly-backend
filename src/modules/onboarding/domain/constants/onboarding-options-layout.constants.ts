export const ONBOARDING_OPTIONS_LAYOUT = {
  chips: 'chips',
  list: 'list',
} as const;

export type OnboardingOptionsLayout =
  (typeof ONBOARDING_OPTIONS_LAYOUT)[keyof typeof ONBOARDING_OPTIONS_LAYOUT];
