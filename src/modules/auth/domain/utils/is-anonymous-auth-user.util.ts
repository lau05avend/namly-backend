import type { User } from '@supabase/supabase-js';

export function isAnonymousAuthUser(user: User): boolean {
  if ('is_anonymous' in user && user.is_anonymous === true) {
    return true;
  }

  return user.app_metadata?.provider === 'anonymous';
}
