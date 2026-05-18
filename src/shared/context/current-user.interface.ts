import type { User } from '@supabase/supabase-js';

export interface CurrentUserInterface extends User {
  // Add any additional properties you expect on the current user
  profile_id?: string;
}
