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
import { Public } from '@common/decorators/public.decorator';
import { CurrentProfileId } from '@common/decorators/current-profile-id.decorator';
import { MealTypesService } from '../../application/meal-types.service';
import type { MealTypeDto } from '../dto/meal-type.dto';
import { CreateMealTypeDto } from '../dto/create-meal-type.dto';
import { UpdateMealTypeDto } from '../dto/update-meal-type.dto';
import { MealTypeMapper } from '../mappers/meal-type.mapper';

@Controller('meal-types')
export class MealTypesController {
  constructor(private readonly mealTypesService: MealTypesService) {}

  @Public()
  @Get('system')
  async getSystemMealTypes(): Promise<MealTypeDto[]> {
    const mealTypes = await this.mealTypesService.getSystemMealTypes();

    return MealTypeMapper.toDtoList(mealTypes);
  }

  @Get()
  async getUserMealTypes(@CurrentProfileId() profileId: string): Promise<MealTypeDto[]> {
    const mealTypes = await this.mealTypesService.getUserMealTypes(profileId);

    return MealTypeMapper.toDtoList(mealTypes);
  }

  @Post()
  async createUserMealType(
    @CurrentProfileId() profileId: string,
    @Body() body: CreateMealTypeDto,
  ): Promise<MealTypeDto> {
    const mealType = await this.mealTypesService.createUserMealType(profileId, body);

    return MealTypeMapper.toDto(mealType);
  }

  @Patch(':id')
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
  async deleteUserMealType(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) mealTypeId: string,
  ): Promise<void> {
    await this.mealTypesService.deleteUserMealType(profileId, mealTypeId);
  }
}
