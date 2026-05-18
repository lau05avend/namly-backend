import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Public } from '@common/decorators/public.decorator';
import { CurrentProfileId } from '@common/decorators/current-profile-id.decorator';
import type { CreateTagItemParams } from '../../domain/interfaces/create-tag-item-params.interface';
import { TagsService } from '../../application/tags.service';
import type { TagDto } from '../dto/tag.dto';
import { CreateTagsDto } from '../dto/create-tags.dto';
import { TagsByCategoryQueryDto } from '../dto/tags-by-category-query.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { TagMapper } from '../mappers/tag.mapper';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Public()
  @Get('system')
  async getSystemTags(@Query() query: TagsByCategoryQueryDto): Promise<TagDto[]> {
    const tags = await this.tagsService.getSystemTagsByCategory(query.category);

    return TagMapper.toDtoList(tags);
  }

  @Get()
  async getUserTags(
    @CurrentProfileId() profileId: string,
    @Query() query: TagsByCategoryQueryDto,
  ): Promise<TagDto[]> {
    const tags = await this.tagsService.getUserTagsByCategory(profileId, query.category);

    return TagMapper.toDtoList(tags);
  }

  @Post()
  async createUserTags(
    @CurrentProfileId() profileId: string,
    @Body() body: CreateTagsDto,
  ): Promise<TagDto[]> {
    const items = this.resolveCreateItems(body);
    const tags = await this.tagsService.createUserTags(profileId, body.category, items);

    return TagMapper.toDtoList(tags);
  }

  @Patch(':id')
  async updateUserTag(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) tagId: string,
    @Body() body: UpdateTagDto,
  ): Promise<TagDto> {
    const tag = await this.tagsService.updateUserTag(profileId, tagId, body);

    return TagMapper.toDto(tag);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserTag(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) tagId: string,
  ): Promise<void> {
    await this.tagsService.deleteUserTag(profileId, tagId);
  }

  private resolveCreateItems(body: CreateTagsDto): CreateTagItemParams[] {
    if (body.tags) {
      return body.tags;
    }

    return [
      {
        name: body.name!,
        iconName: body.iconName,
      },
    ];
  }
}
