import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import type { User } from '@supabase/supabase-js';
import { CurrentAuthUser } from '@common/decorators/current-auth-user.decorator';
import { SyncAuthMeUseCase } from '../../application/use-cases/sync-auth-me.use-case';
import { AuthMeResponseDto } from '../dto/auth-me-response.dto';
import { SyncAuthMeDto } from '../dto/sync-auth-me.dto';
import { AuthMeMapper } from '../mappers/auth-me.mapper';

@Controller('auth')
export class AuthController {
  constructor(private readonly syncAuthMeUseCase: SyncAuthMeUseCase) {}

  @Post('me')
  @HttpCode(HttpStatus.OK)
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
