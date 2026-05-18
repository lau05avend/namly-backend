import { Module } from '@nestjs/common';
import { TagsService } from './application/tags.service';
import { TagRepository } from './infrastructure/repositories/tag.repository';
import { TagsController } from './presentation/controllers/tags.controller';

@Module({
  controllers: [TagsController],
  providers: [TagsService, TagRepository],
  exports: [TagsService],
})
export class TagsModule {}
