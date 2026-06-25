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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '@common/decorators/public.decorator';
import { CurrentProfileId } from '@common/decorators/current-profile-id.decorator';
import { ApiPublicOperation } from '@/docs/swagger/decorators/api-public-operation.decorator';
import { ApiStandardMutationResponses } from '@/docs/swagger/decorators/api-standard-responses.decorator';
import { SWAGGER_BEARER_AUTH } from '@/docs/swagger/swagger.constants';
import type { CreateTagItemParams } from '../../domain/interfaces/create-tag-item-params.interface';
import { TagsService } from '../../application/tags.service';
import { TagDto } from '../dto/tag.dto';
import { CreateTagsDto } from '../dto/create-tags.dto';
import { TagsByCategoryQueryDto } from '../dto/tags-by-category-query.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { TagMapper } from '../mappers/tag.mapper';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Public()
  @Get('system')
  @ApiPublicOperation({ summary: 'Listar etiquetas de sistema por categoría' })
  @ApiOkResponse({ type: TagDto, isArray: true })
  async getSystemTags(@Query() query: TagsByCategoryQueryDto): Promise<TagDto[]> {
    const tags = await this.tagsService.getSystemTagsByCategory(query.category);

    return TagMapper.toDtoList(tags);
  }

  @Get()
  @ApiBearerAuth(SWAGGER_BEARER_AUTH)
  @ApiOperation({ summary: 'Listar etiquetas del usuario por categoría' })
  @ApiOkResponse({ type: TagDto, isArray: true })
  @ApiStandardMutationResponses()
  async getUserTags(
    @CurrentProfileId() profileId: string,
    @Query() query: TagsByCategoryQueryDto,
  ): Promise<TagDto[]> {
    const tags = await this.tagsService.getUserTagsByCategory(profileId, query.category);

    return TagMapper.toDtoList(tags);
  }

  @Post()
  @ApiBearerAuth(SWAGGER_BEARER_AUTH)
  @ApiOperation({ summary: 'Crear etiquetas del usuario' })
  @ApiCreatedResponse({ type: TagDto, isArray: true })
  @ApiStandardMutationResponses()
  async createUserTags(
    @CurrentProfileId() profileId: string,
    @Body() body: CreateTagsDto,
  ): Promise<TagDto[]> {
    const items = this.resolveCreateItems(body);
    const tags = await this.tagsService.createUserTags(profileId, body.category, items);

    return TagMapper.toDtoList(tags);
  }

  @Patch(':id')
  @ApiBearerAuth(SWAGGER_BEARER_AUTH)
  @ApiOperation({ summary: 'Actualizar etiqueta del usuario' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: TagDto })
  @ApiStandardMutationResponses()
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
  @ApiBearerAuth(SWAGGER_BEARER_AUTH)
  @ApiOperation({ summary: 'Eliminar etiqueta del usuario' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Etiqueta eliminada' })
  @ApiStandardMutationResponses()
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
