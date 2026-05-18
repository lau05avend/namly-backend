import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { ProfileEntity } from '../domain/entities/profile.entity';
import type { UpdateProfileParams } from '../domain/interfaces/update-profile-params.interface';
import { ProfileRepository } from '../infrastructure/repositories/profile.repository';

@Injectable()
export class ProfilesService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async getProfile(profileId: string): Promise<ProfileEntity> {
    const profile = await this.profileRepository.findById(profileId);

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async updateProfile(profileId: string, params: UpdateProfileParams): Promise<ProfileEntity> {
    if (params.displayName === undefined && params.avatarUrl === undefined) {
      throw new BadRequestException('At least one field must be provided');
    }

    const existingProfile = await this.profileRepository.findById(profileId);

    if (!existingProfile) {
      throw new NotFoundException('Profile not found');
    }

    const updatedProfile = await this.profileRepository.updateById(profileId, {
      ...(params.displayName !== undefined && { displayName: params.displayName }),
      ...(params.avatarUrl !== undefined && { avatarUrl: params.avatarUrl }),
    });

    if (!updatedProfile) {
      throw new NotFoundException('Profile not found');
    }

    return updatedProfile;
  }
}
