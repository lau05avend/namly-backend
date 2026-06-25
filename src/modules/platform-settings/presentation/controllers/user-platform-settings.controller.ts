import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CurrentProfileId } from '@common/decorators/current-profile-id.decorator';
import { ApiBodyExample } from '@/docs/swagger/decorators/api-body-example.decorator';
import { ApiProtectedTag } from '@/docs/swagger/decorators/api-protected.decorator';
import { ApiStandardMutationResponses } from '@/docs/swagger/decorators/api-standard-responses.decorator';
import { SwaggerRequestExamples } from '@/docs/swagger/swagger.examples';
import { PlatformSettingsService } from '../../application/platform-settings.service';
import { PlatformSettingsDto } from '../dto/platform-settings.dto';
import { UpdatePlatformSettingsDto } from '../dto/update-platform-settings.dto';
import { PlatformSettingsMapper } from '../mappers/platform-settings.mapper';

@ApiProtectedTag('Platform Settings')
@Controller('user')
export class UserPlatformSettingsController {
  constructor(private readonly platformSettingsService: PlatformSettingsService) {}

  @Get('platform-settings')
  @ApiOperation({ summary: 'Obtener preferencias de plataforma del usuario' })
  @ApiOkResponse({ type: PlatformSettingsDto })
  @ApiStandardMutationResponses()
  async getPlatformSettings(@CurrentProfileId() profileId: string): Promise<PlatformSettingsDto> {
    const settings = await this.platformSettingsService.getByUserId(profileId);

    return PlatformSettingsMapper.toDto(settings);
  }

  @Patch('platform-settings')
  @ApiBodyExample(UpdatePlatformSettingsDto, SwaggerRequestExamples.updatePlatformSettings)
  @ApiOperation({ summary: 'Actualizar preferencias de plataforma del usuario' })
  @ApiOkResponse({ type: PlatformSettingsDto })
  @ApiStandardMutationResponses()
  async patchPlatformSettings(
    @CurrentProfileId() profileId: string,
    @Body() body: UpdatePlatformSettingsDto,
  ): Promise<PlatformSettingsDto> {
    const settings = await this.platformSettingsService.updateByUserId(profileId, body);

    return PlatformSettingsMapper.toDto(settings);
  }
}
