import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule],
  providers: [], // Event listeners will be registered here
  exports: [EventEmitterModule],
})
export class AppEventsModule {}
