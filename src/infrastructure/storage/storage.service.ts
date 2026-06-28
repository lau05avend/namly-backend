import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import {
  parseSupabasePublicUrl,
  type SupabaseStorageObjectRef,
} from './parse-supabase-public-url.util';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly supabaseUrl: string;
  private readonly adminClient: ReturnType<typeof createClient>;

  constructor(configService: ConfigService) {
    const url = configService.get<string>('supabase.url');
    const serviceRoleKey = configService.get<string>('supabase.serviceRoleKey');

    if (!url || !serviceRoleKey) {
      throw new Error('Supabase URL and service role key must be configured');
    }

    this.supabaseUrl = url;
    this.adminClient = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  async deleteByPublicUrls(urls: readonly string[]): Promise<void> {
    const objectsByBucket = this.groupObjectsByBucket(urls);

    for (const [bucket, paths] of objectsByBucket.entries()) {
      const uniquePaths = [...new Set(paths)];

      const { error } = await this.adminClient.storage.from(bucket).remove(uniquePaths);

      if (error) {
        this.logger.warn(
          `Failed to delete storage objects from bucket "${bucket}": ${error.message}`,
        );
      }
    }
  }

  private groupObjectsByBucket(urls: readonly string[]): Map<string, string[]> {
    const objectsByBucket = new Map<string, string[]>();

    for (const url of urls) {
      const objectRef: SupabaseStorageObjectRef | null = parseSupabasePublicUrl(
        url,
        this.supabaseUrl,
      );

      if (!objectRef) {
        continue;
      }

      const paths = objectsByBucket.get(objectRef.bucket) ?? [];
      paths.push(objectRef.path);
      objectsByBucket.set(objectRef.bucket, paths);
    }

    return objectsByBucket;
  }
}
