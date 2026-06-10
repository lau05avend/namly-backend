import type { User } from '@supabase/supabase-js';
import type { AuthJwtClaims } from '../interfaces/auth-jwt-claims.interface';

function readString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

export function extractAuthJwtClaims(user: User): AuthJwtClaims {
  const provider = readString(user.app_metadata?.provider);
  const externalId = readString(user.user_metadata?.provider_id);
  const fullName = readString(user.user_metadata?.full_name);
  const avatarUrl = readString(user.user_metadata?.avatar_url);
  const email = readString(user.email);

  return {
    authUserId: user.id,
    email,
    provider: provider ?? '',
    externalId: externalId ?? '',
    fullName,
    avatarUrl,
  };
}

export function resolveInitialDisplayName(
  displayName: string | undefined,
  claims: AuthJwtClaims,
): string {
  if (displayName && displayName.trim().length > 0) {
    return displayName.trim();
  }

  if (claims.fullName) {
    return claims.fullName;
  }

  if (claims.email) {
    const localPart = claims.email.split('@')[0]?.trim();
    if (localPart) {
      return localPart;
    }
  }

  return 'Usuario';
}
