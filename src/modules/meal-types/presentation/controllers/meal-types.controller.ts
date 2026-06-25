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
import { MealTypeDto } from '../dto/meal-type.dto';
import { CreateMealTypeDto } from '../dto/create-meal-type.dto';
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
  @ApiOperation({ summary: 'Listar tipos de comida del usuario' })
  @ApiOkResponse({ type: MealTypeDto, isArray: true })
  @ApiStandardMutationResponses()
  async getUserMealTypes(@CurrentProfileId() profileId: string): Promise<MealTypeDto[]> {
    const mealTypes = await this.mealTypesService.getUserMealTypes(profileId);

    return MealTypeMapper.toDtoList(mealTypes);
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
