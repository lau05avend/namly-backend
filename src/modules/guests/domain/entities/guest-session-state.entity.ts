export interface GuestSessionStateEntity {
  readonly isGuest: boolean;
  readonly guestExpiresAt: string | null;
  readonly isExpired: boolean;
}
