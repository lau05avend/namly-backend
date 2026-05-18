import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

type SupabaseBrowserClient = ReturnType<typeof createClient>;

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseBrowserClient;

  constructor(configService: ConfigService) {
    const url = configService.get<string>('supabase.url');
    const anonKey = configService.get<string>('supabase.anonKey');

    if (!url || !anonKey) {
      throw new Error('Supabase URL and anon key must be configured');
    }

    this.client = createClient(url, anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  getClient(): SupabaseBrowserClient {
    return this.client;
  }
}
