export interface AuthJwtClaims {
  authUserId: string;
  email: string | null;
  provider: string;
  externalId: string;
  fullName: string | null;
  avatarUrl: string | null;
}
