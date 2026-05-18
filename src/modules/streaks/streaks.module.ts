
import { Module } from '@nestjs/common';
import { StreaksService } from './application/streaks.service';

@Module({
  providers: [StreaksService],
  exports: [StreaksService],
})
export class StreaksModule {}
