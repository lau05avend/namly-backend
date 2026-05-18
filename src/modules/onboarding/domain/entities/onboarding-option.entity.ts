export interface OnboardingOptionEntity {
  readonly id: string;
  readonly label: string;
  readonly iconName: string | null;
  readonly isDefault: boolean;
  readonly sortOrder: number;
  readonly linkedTagId: string | null;
}
