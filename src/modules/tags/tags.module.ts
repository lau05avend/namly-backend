import { Module } from '@nestjs/common';
import { TagsService } from './application/tags.service';
import { TagKeywordRepository } from './infrastructure/repositories/tag-keyword.repository';
import { TagReadRepository } from './infrastructure/repositories/tag-read.repository';
import { TagRepository } from './infrastructure/repositories/tag.repository';
import { TagsController } from './presentation/controllers/tags.controller';

@Module({
  controllers: [TagsController],
  providers: [TagsService, TagRepository, TagKeywordRepository, TagReadRepository],
  exports: [TagsService, TagKeywordRepository, TagReadRepository],
})
export class TagsModule {}
