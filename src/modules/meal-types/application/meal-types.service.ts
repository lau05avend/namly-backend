import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { MealTypeEntity } from '../domain/entities/meal-type.entity';
import type { MealTypeListItemEntity } from '../domain/entities/meal-type-list-item.entity';
import type { CreateMealTypeParams } from '../domain/interfaces/create-meal-type-params.interface';
import type { GetUserMealTypesOptions } from '../domain/interfaces/get-user-meal-types-options.interface';
import type { UpdateMealTypeParams } from '../domain/interfaces/update-meal-type-params.interface';
import { DEFAULT_FREQUENT_MEAL_TYPES_LIMIT } from '../domain/constants/meal-type-list.constants';
import { validateMealTypeReorder } from '../domain/rules/validate-meal-type-reorder.util';
import { resolveFrequentMealTypeIds } from '../domain/utils/resolve-frequent-meal-type-ids.util';
import {
  resolveAllMealTypesWithFrequentFlag,
  resolveFrequentMealTypes,
} from '../domain/utils/resolve-frequent-meal-types.util';
import { MealTypeRepository } from '../infrastructure/repositories/meal-type.repository';

@Injectable()
export class MealTypesService {
  constructor(private readonly mealTypeRepository: MealTypeRepository) {}

  getSystemMealTypes(): Promise<MealTypeEntity[]> {
    return this.mealTypeRepository.findSystemMealTypes();
  }

  async getUserMealTypes(
    profileId: string,
    options: GetUserMealTypesOptions,
  ): Promise<MealTypeListItemEntity[]> {
    await this.mealTypeRepository.ensureUserMealTypesInitialized(profileId);

    const [userMealTypes, usageCountByMealTypeId] = await Promise.all([
      this.mealTypeRepository.findUserMealTypesByProfileId(profileId),
      this.mealTypeRepository.findMealTypeUsageCountsByProfileId(profileId),
    ]);

    const frequentMealTypeIds = resolveFrequentMealTypeIds(
      userMealTypes,
      usageCountByMealTypeId,
      options.limit,
    );

    if (options.view === 'frequent') {
      return resolveFrequentMealTypes(userMealTypes, frequentMealTypeIds);
    }

    return resolveAllMealTypesWithFrequentFlag(userMealTypes, frequentMealTypeIds);
  }

  async reorderUserMealTypes(
    profileId: string,
    mealTypeIds: readonly string[],
  ): Promise<MealTypeListItemEntity[]> {
    await this.mealTypeRepository.ensureUserMealTypesInitialized(profileId);

    const existingMealTypeIds =
      await this.mealTypeRepository.findUserMealTypeIdsByProfileId(profileId);

    const validationError = validateMealTypeReorder(existingMealTypeIds, mealTypeIds);

    if (validationError === 'incomplete') {
      throw new BadRequestException('mealTypeIds must include every user meal type exactly once');
    }

    if (validationError === 'unknown-id') {
      throw new BadRequestException('One or more meal type IDs are invalid for this profile');
    }

    await this.mealTypeRepository.reorderUserMealTypes(profileId, mealTypeIds);

    return this.getUserMealTypes(profileId, {
      view: 'all',
      limit: DEFAULT_FREQUENT_MEAL_TYPES_LIMIT,
    });
  }

  async createUserMealType(
    profileId: string,
    params: CreateMealTypeParams,
  ): Promise<MealTypeEntity> {
    const sortOrderExists = await this.mealTypeRepository.existsUserMealTypeWithSortOrder(
      profileId,
      params.sortOrder,
    );

    if (sortOrderExists) {
      throw new ConflictException(`A meal type with sort order ${params.sortOrder} already exists`);
    }

    const nameExists = await this.mealTypeRepository.existsUserMealTypeWithName(
      profileId,
      params.name,
    );

    if (nameExists) {
      throw new ConflictException(`A meal type with name "${params.name}" already exists`);
    }

    return this.mealTypeRepository.createUserMealType(profileId, params);
  }

  async updateUserMealType(
    profileId: string,
    mealTypeId: string,
    params: UpdateMealTypeParams,
  ): Promise<MealTypeEntity> {
    if (!params.name && !params.sortOrder) {
      throw new BadRequestException('At least one field must be provided');
    }

    const updated = await this.mealTypeRepository.updateUserMealType(profileId, mealTypeId, params);

    if (!updated) {
      throw new NotFoundException('Meal type not found');
    }

    return updated;
  }

  async deleteUserMealType(profileId: string, mealTypeId: string): Promise<void> {
    const deleted = await this.mealTypeRepository.softDeleteUserMealType(profileId, mealTypeId);

    if (!deleted) {
      throw new NotFoundException('Meal type not found');
    }
  }

  async assertAccessibleForProfile(profileId: string, mealTypeId: string): Promise<void> {
    const accessible = await this.mealTypeRepository.isAccessibleForProfile(profileId, mealTypeId);

    if (!accessible) {
      throw new NotFoundException('Meal type not found');
    }
  }
}
