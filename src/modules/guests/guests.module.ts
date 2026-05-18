
import { Module } from '@nestjs/common';
import { GuestsService } from './application/guests.service';

@Module({
  providers: [GuestsService],
  exports: [GuestsService],
})
export class GuestsModule {}
