import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { SupabaseAuthGuard } from '@common/guards/supabase-auth.guard';
import { RequestContextInterceptor } from '@common/interceptors/request-context.interceptor';
import { LoggingInterceptor } from '@common/interceptors/logging.interceptor';
import { ProfilesModule } from '@modules/profiles/profiles.module';
import { AuthService } from './application/auth.service';
import { SyncAuthMeUseCase } from './application/use-cases/sync-auth-me.use-case';
import { AuthIdentityRepository } from './infrastructure/repositories/auth-identity.repository';
import { AuthController } from './presentation/controllers/auth.controller';

@Module({
  imports: [ProfilesModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    SyncAuthMeUseCase,
    AuthIdentityRepository,
    {
      provide: APP_GUARD,
      useClass: SupabaseAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestContextInterceptor,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
