import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { User } from '@supabase/supabase-js';
import { SupabaseService } from '@infrastructure/database/supabase/supabase.service';
import type { CurrentUserInterface } from '@shared/context/current-user.interface';
import { AuthIdentityRepository } from '../infrastructure/repositories/auth-identity.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly authIdentityRepository: AuthIdentityRepository,
  ) {}

  async validateAccessToken(accessToken: string): Promise<User> {
    const { data, error } = await this.supabaseService.getClient().auth.getUser(accessToken);

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return data.user;
  }

  async resolveProfileId(authUserId: string): Promise<string> {
    const identity = await this.authIdentityRepository.findByAuthUserId(authUserId);

    return identity?.profile.id ?? authUserId;
  }

  toCurrentUser(user: User, profileId: string): CurrentUserInterface {
    return {
      ...user,
      profile_id: profileId,
    };
  }
}
