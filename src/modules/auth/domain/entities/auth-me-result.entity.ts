export type AuthMeResultEntity = {
  id: string;
  displayName: string | null;
  avatarUrl: string | null;
  email: string | null;
  hasCompletedOnboarding: boolean;
  isNewUser: boolean;
};
