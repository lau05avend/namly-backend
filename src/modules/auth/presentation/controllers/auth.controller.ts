import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import type { User } from '@supabase/supabase-js';
import { CurrentAuthUser } from '@common/decorators/current-auth-user.decorator';
import { ApiBodyExample } from '@/docs/swagger/decorators/api-body-example.decorator';
import { ApiStandardMutationResponses } from '@/docs/swagger/decorators/api-standard-responses.decorator';
import { ApiProtectedTag } from '@/docs/swagger/decorators/api-protected.decorator';
import { SwaggerRequestExamples } from '@/docs/swagger/swagger.examples';
import { SyncAuthMeUseCase } from '../../application/use-cases/sync-auth-me.use-case';
import { AuthMeResponseDto } from '../dto/auth-me-response.dto';
import { SyncAuthMeDto } from '../dto/sync-auth-me.dto';
import { AuthMeMapper } from '../mappers/auth-me.mapper';

@ApiProtectedTag('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly syncAuthMeUseCase: SyncAuthMeUseCase) {}

  @Post('me')
  @HttpCode(HttpStatus.OK)
  @ApiBodyExample(SyncAuthMeDto, SwaggerRequestExamples.syncAuthMe)
  @ApiOperation({
    summary: 'Sincronizar sesión',
    description:
      'Valida el token de Supabase, crea o actualiza el perfil interno y devuelve el estado de la sesión.',
  })
  @ApiOkResponse({ type: AuthMeResponseDto })
  @ApiStandardMutationResponses()
  async syncMe(
    @CurrentAuthUser() authUser: User,
    @Body() body: SyncAuthMeDto,
  ): Promise<AuthMeResponseDto> {
    const result = await this.syncAuthMeUseCase.execute(authUser, {
      displayName: body.displayName,
    });

    return AuthMeMapper.toDto(result);
  }
}
