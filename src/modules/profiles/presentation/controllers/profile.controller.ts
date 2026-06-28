import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CurrentProfileId } from '@common/decorators/current-profile-id.decorator';
import { NonProductionGuard } from '@common/guards/non-production.guard';
import { ApiBodyExample } from '@/docs/swagger/decorators/api-body-example.decorator';
import { ApiProtectedTag } from '@/docs/swagger/decorators/api-protected.decorator';
import { ApiStandardMutationResponses } from '@/docs/swagger/decorators/api-standard-responses.decorator';
import { SwaggerRequestExamples } from '@/docs/swagger/swagger.examples';
import { DeleteProfileAccountUseCase } from '../../application/use-cases/delete-profile-account.use-case';
import { ProfilesService } from '../../application/profiles.service';
import { ProfileDto } from '../dto/profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ProfileMapper } from '../mappers/profile.mapper';

@ApiProtectedTag('Profile')
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly deleteProfileAccountUseCase: DeleteProfileAccountUseCase,
  ) {}

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

  @Delete('account')
  @UseGuards(NonProductionGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar cuenta y todos los datos del usuario (solo dev/test)',
    description:
      'Borrado irreversible del perfil, datos en PostgreSQL, media privada en Storage y usuario en Supabase Auth. ' +
      'Las recetas públicas del usuario se preservan como recursos compartidos (`profile_id = null`). ' +
      'No disponible en producción.',
  })
  @ApiNoContentResponse({ description: 'Cuenta eliminada' })
  @ApiStandardMutationResponses()
  async deleteAccount(@CurrentProfileId() profileId: string): Promise<void> {
    await this.deleteProfileAccountUseCase.execute(profileId); // TODO: Devolver una respuesta con consolidado de lo eliminado
  }
}
