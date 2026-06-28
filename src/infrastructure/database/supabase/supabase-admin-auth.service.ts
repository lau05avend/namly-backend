import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseAdminAuthService {
  private readonly logger = new Logger(SupabaseAdminAuthService.name);
  private readonly adminClient: ReturnType<typeof createClient>;

  constructor(configService: ConfigService) {
    const url = configService.get<string>('supabase.url');
    const serviceRoleKey = configService.get<string>('supabase.serviceRoleKey');

    if (!url || !serviceRoleKey) {
      throw new Error('Supabase URL and service role key must be configured');
    }

    this.adminClient = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  async deleteUser(authUserId: string): Promise<void> {
    const { error } = await this.adminClient.auth.admin.deleteUser(authUserId);

    if (error) {
      this.logger.error(`Failed to delete Supabase auth user ${authUserId}: ${error.message}`);
      throw new InternalServerErrorException('Failed to delete authentication account');
    }
  }
}
