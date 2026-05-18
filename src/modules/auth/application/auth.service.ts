import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { User } from '@supabase/supabase-js';
import { SupabaseService } from '@infrastructure/database/supabase/supabase.service';
import type { CurrentUserInterface } from '@shared/context/current-user.interface';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async validateAccessToken(accessToken: string): Promise<User> {
    const { data, error } = await this.supabaseService.getClient().auth.getUser(accessToken);

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return data.user;
  }

  toCurrentUser(user: User): CurrentUserInterface {
    return {
      ...user,
      profile_id: user.id,
    };
  }
}
