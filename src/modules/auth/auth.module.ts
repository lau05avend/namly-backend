import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { SupabaseAuthGuard } from '@common/guards/supabase-auth.guard';
import { RequestContextInterceptor } from '@common/interceptors/request-context.interceptor';
import { AuthService } from './application/auth.service';

@Module({
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: SupabaseAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestContextInterceptor,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
