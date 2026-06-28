import { Injectable } from '@nestjs/common';
import { SupabaseAdminAuthService } from '@infrastructure/database/supabase/supabase-admin-auth.service';
import { StorageService } from '@infrastructure/storage/storage.service';
import { ProfileResetRepository } from '../../infrastructure/repositories/profile-reset.repository';

@Injectable()
export class DeleteProfileAccountUseCase {
  constructor(
    private readonly profileResetRepository: ProfileResetRepository,
    private readonly storageService: StorageService,
    private readonly supabaseAdminAuthService: SupabaseAdminAuthService,
  ) {}

  async execute(profileId: string): Promise<void> {
    const resetContext = await this.profileResetRepository.findResetContext(profileId);

    await this.profileResetRepository.deleteAccountData(profileId);
    await this.storageService.deleteByPublicUrls(resetContext.mediaUrls);
    await this.supabaseAdminAuthService.deleteUser(resetContext.authUserId);
  }
}
