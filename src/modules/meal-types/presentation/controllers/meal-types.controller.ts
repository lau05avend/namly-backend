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
  Put,
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
import { MealTypesService } from '../../application/meal-types.service';
import type { MealTypeListItemEntity } from '../../domain/entities/meal-type-list-item.entity';
import { MealTypeDto } from '../dto/meal-type.dto';
import { ListMealTypesQueryDto } from '../dto/list-meal-types-query.dto';
import { CreateMealTypeDto } from '../dto/create-meal-type.dto';
import { ReorderMealTypesDto } from '../dto/reorder-meal-types.dto';
import { UpdateMealTypeDto } from '../dto/update-meal-type.dto';
import { MealTypeMapper } from '../mappers/meal-type.mapper';

@ApiTags('Meal Types')
@Controller('meal-types')
export class MealTypesController {
  constructor(private readonly mealTypesService: MealTypesService) {}

  @Public()
  @Get('system')
  @ApiPublicOperation({ summary: 'Listar tipos de comida de sistema' })
  @ApiOkResponse({ type: MealTypeDto, isArray: true })
  async getSystemMealTypes(): Promise<MealTypeDto[]> {
    const mealTypes = await this.mealTypesService.getSystemMealTypes();

    return MealTypeMapper.toDtoList(mealTypes);
  }

  @Get()
  @ApiBearerAuth(SWAGGER_BEARER_AUTH)
  @ApiOperation({
    summary: 'Listar tipos de comida del usuario',
    description:
      'Por defecto (`view=all`) devuelve todos los tipos ordenados por `sortOrder` con `isFrequent` en cada ítem. ' +
      'Con `view=frequent` devuelve solo el top N habitual según uso en meal logs y comidas planificadas.',
  })
  @ApiOkResponse({ type: MealTypeDto, isArray: true })
  @ApiStandardMutationResponses()
  async getUserMealTypes(
    @CurrentProfileId() profileId: string,
    @Query() query: ListMealTypesQueryDto,
  ): Promise<MealTypeDto[]> {
    const mealTypes: MealTypeListItemEntity[] = await this.mealTypesService.getUserMealTypes(
      profileId,
      {
        view: query.view,
        limit: query.limit,
      },
    );

    return MealTypeMapper.toListItemDtoList(mealTypes);
  }

  @Post()
  @ApiBearerAuth(SWAGGER_BEARER_AUTH)
  @ApiOperation({ summary: 'Crear tipo de comida del usuario' })
  @ApiCreatedResponse({ type: MealTypeDto })
  @ApiStandardMutationResponses()
  async createUserMealType(
    @CurrentProfileId() profileId: string,
    @Body() body: CreateMealTypeDto,
  ): Promise<MealTypeDto> {
    const mealType = await this.mealTypesService.createUserMealType(profileId, body);

    return MealTypeMapper.toDto(mealType);
  }

  @Put('reorder')
  @ApiBearerAuth(SWAGGER_BEARER_AUTH)
  @ApiOperation({
    summary: 'Reordenar tipos de comida del usuario de forma masiva',
    description:
      'Recibe la lista completa de IDs en el orden deseado. La posición en el array define `sortOrder` (0-based).',
  })
  @ApiOkResponse({ type: MealTypeDto, isArray: true })
  @ApiStandardMutationResponses()
  async reorderUserMealTypes(
    @CurrentProfileId() profileId: string,
    @Body() body: ReorderMealTypesDto,
  ): Promise<MealTypeDto[]> {
    const mealTypes: MealTypeListItemEntity[] = await this.mealTypesService.reorderUserMealTypes(
      profileId,
      body.mealTypeIds,
    );

    return MealTypeMapper.toListItemDtoList(mealTypes);
  }

  @Patch(':id')
  @ApiBearerAuth(SWAGGER_BEARER_AUTH)
  @ApiOperation({ summary: 'Actualizar tipo de comida del usuario' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: MealTypeDto })
  @ApiStandardMutationResponses()
  async updateUserMealType(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) mealTypeId: string,
    @Body() body: UpdateMealTypeDto,
  ): Promise<MealTypeDto> {
    const mealType = await this.mealTypesService.updateUserMealType(profileId, mealTypeId, body);

    return MealTypeMapper.toDto(mealType);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth(SWAGGER_BEARER_AUTH)
  @ApiOperation({ summary: 'Eliminar tipo de comida del usuario' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Tipo de comida eliminado' })
  @ApiStandardMutationResponses()
  async deleteUserMealType(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) mealTypeId: string,
  ): Promise<void> {
    await this.mealTypesService.deleteUserMealType(profileId, mealTypeId);
  }
}
