import { Module } from '@nestjs/common';
import { PrismaModule } from '@infrastructure/database/prisma/prisma.module';
import { GuestsService } from './application/guests.service';
import { GuestSessionRepository } from './infrastructure/repositories/guest-session.repository';

@Module({
  imports: [PrismaModule],
  providers: [GuestsService, GuestSessionRepository],
  exports: [GuestsService],
})
export class GuestsModule {}
