import type { CurrentUserInterface } from './current-user.interface';

export interface NamlyContextData {
  readonly isPublic: boolean;
  readonly userId: string | null;
  readonly user: CurrentUserInterface | null;
}
