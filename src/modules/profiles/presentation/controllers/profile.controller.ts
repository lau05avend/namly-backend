import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CurrentProfileId } from '@common/decorators/current-profile-id.decorator';
import { ApiBodyExample } from '@/docs/swagger/decorators/api-body-example.decorator';
import { ApiProtectedTag } from '@/docs/swagger/decorators/api-protected.decorator';
import { ApiStandardMutationResponses } from '@/docs/swagger/decorators/api-standard-responses.decorator';
import { SwaggerRequestExamples } from '@/docs/swagger/swagger.examples';
import { ProfilesService } from '../../application/profiles.service';
import { ProfileDto } from '../dto/profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ProfileMapper } from '../mappers/profile.mapper';

@ApiProtectedTag('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiOkResponse({ type: ProfileDto })
  @ApiStandardMutationResponses()
  async getProfile(@CurrentProfileId() profileId: string): Promise<ProfileDto> {
    const profile = await this.profilesService.getProfile(profileId);

    return ProfileMapper.toDto(profile);
  }

  @Patch()
  @ApiBodyExample(UpdateProfileDto, { displayName: SwaggerRequestExamples.syncAuthMe.displayName })
  @ApiOperation({ summary: 'Actualizar perfil del usuario autenticado' })
  @ApiOkResponse({ type: ProfileDto })
  @ApiStandardMutationResponses()
  async updateProfile(
    @CurrentProfileId() profileId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileDto> {
    const profile = await this.profilesService.updateProfile(profileId, updateProfileDto);

    return ProfileMapper.toDto(profile);
  }
}
