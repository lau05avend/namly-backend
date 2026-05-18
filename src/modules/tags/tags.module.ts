
import { Module } from '@nestjs/common';
import { TagsService } from './application/tags.service';

@Module({
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
