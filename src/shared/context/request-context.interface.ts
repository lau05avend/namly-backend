import type { Request } from 'express';
import type { CurrentUserInterface } from './current-user.interface';

export interface RequestContext extends Request {
  user?: CurrentUserInterface;
  isGuest?: boolean;
  // Add other request-scoped data here
}
