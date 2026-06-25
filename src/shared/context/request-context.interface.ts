import type { User } from '@supabase/supabase-js';
import type { Request } from 'express';
import type { CurrentUserInterface } from './current-user.interface';
import type { NamlyContextData } from './namly-context.interface';

export interface RequestContext extends Request {
  context: NamlyContextData;
  /** Set by SupabaseAuthGuard after successful JWT validation. */
  authUserId?: string;
  /** Set by SupabaseAuthGuard; consumed by RequestContextInterceptor only. */
  authUser?: User;
  /** Mapped current user; set by RequestContextInterceptor for downstream use. */
  user?: CurrentUserInterface;

  /** Set by LoggingInterceptor for request duration tracking. */
  requestStartedAt?: number;

  /** TODO: guest user */
  isGuest?: boolean;
}
