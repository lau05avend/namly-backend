import { Body, Controller, Get, Patch } from '@nestjs/common';
import { CurrentProfileId } from '@common/decorators/current-profile-id.decorator';
import { ProfilesService } from '../../application/profiles.service';
import type { ProfileDto } from '../dto/profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ProfileMapper } from '../mappers/profile.mapper';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  async getProfile(@CurrentProfileId() profileId: string): Promise<ProfileDto> {
    const profile = await this.profilesService.getProfile(profileId);

    return ProfileMapper.toDto(profile);
  }

  @Patch()
  async updateProfile(
    @CurrentProfileId() profileId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileDto> {
    const profile = await this.profilesService.updateProfile(profileId, updateProfileDto);

    return ProfileMapper.toDto(profile);
  }
}
