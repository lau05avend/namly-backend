import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import type { MealTypeEntity } from '../../domain/entities/meal-type.entity';
import type { CreateMealTypeParams } from '../../domain/interfaces/create-meal-type-params.interface';
import type { UpdateMealTypeParams } from '../../domain/interfaces/update-meal-type-params.interface';

const mealTypeSelect = {
  id: true,
  name: true,
  sortOrder: true,
} as const;

type MealTypeRecord = {
  id: string;
  name: string;
  sortOrder: number;
};

const systemMealTypeWhere = {
  profileId: null,
  isSystemDefined: true,
  deletedAt: null,
  isVisible: true,
} as const;

const userMealTypeWhere = (profileId: string) =>
  ({
    profileId,
    isSystemDefined: false,
    deletedAt: null,
  }) as const;

@Injectable()
export class MealTypeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findSystemMealTypes(): Promise<MealTypeEntity[]> {
    const records = await this.prisma.mealType.findMany({
      where: systemMealTypeWhere,
      orderBy: { sortOrder: 'asc' },
      select: mealTypeSelect,
    });

    return records.map((record) => this.toEntity(record));
  }

  async findUserMealTypesByProfileId(profileId: string): Promise<MealTypeEntity[]> {
    const records = await this.prisma.mealType.findMany({
      where: userMealTypeWhere(profileId),
      orderBy: { sortOrder: 'asc' },
      select: mealTypeSelect,
    });

    return records.map((record) => this.toEntity(record));
  }

  async countUserMealTypesByProfileId(profileId: string): Promise<number> {
    return this.prisma.mealType.count({
      where: userMealTypeWhere(profileId),
    });
  }

  async ensureUserMealTypesInitialized(profileId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const existingCount = await tx.mealType.count({
        where: userMealTypeWhere(profileId),
      });

      if (existingCount > 0) {
        return;
      }

      const systemTypes = await tx.mealType.findMany({
        where: systemMealTypeWhere,
        orderBy: { sortOrder: 'asc' },
        select: {
          name: true,
          sortOrder: true,
        },
      });

      if (systemTypes.length === 0) {
        return;
      }

      await tx.mealType.createMany({
        data: systemTypes.map((systemType) => ({
          profileId,
          name: systemType.name,
          sortOrder: systemType.sortOrder,
          isSystemDefined: false,
        })),
      });
    });
  }

  async existsUserMealTypeWithSortOrder(profileId: string, sortOrder: number): Promise<boolean> {
    const count = await this.prisma.mealType.count({
      where: {
        ...userMealTypeWhere(profileId),
        sortOrder,
      },
    });

    return count > 0;
  }

  async existsUserMealTypeWithName(profileId: string, name: string): Promise<boolean> {
    const count = await this.prisma.mealType.count({
      where: {
        ...userMealTypeWhere(profileId),
        name,
      },
    });

    return count > 0;
  }

  async createUserMealType(
    profileId: string,
    params: CreateMealTypeParams,
  ): Promise<MealTypeEntity> {
    const record = await this.prisma.mealType.create({
      data: {
        profileId,
        name: params.name,
        sortOrder: params.sortOrder,
        isSystemDefined: false,
      },
      select: mealTypeSelect,
    });

    return this.toEntity(record);
  }

  async updateUserMealType(
    profileId: string,
    mealTypeId: string,
    params: UpdateMealTypeParams,
  ): Promise<MealTypeEntity | null> {
    const owned = await this.findOwnedUserMealType(profileId, mealTypeId);

    if (!owned) {
      return null;
    }

    const record = await this.prisma.mealType.update({
      where: { id: mealTypeId },
      data: {
        ...(params.name && { name: params.name }),
        ...(params.sortOrder && { sortOrder: params.sortOrder }),
      },
      select: mealTypeSelect,
    });

    return this.toEntity(record);
  }

  async softDeleteUserMealType(
    profileId: string,
    mealTypeId: string,
  ): Promise<MealTypeEntity | null> {
    const owned = await this.findOwnedUserMealType(profileId, mealTypeId);

    if (!owned) {
      return null;
    }

    const record = await this.prisma.mealType.update({
      where: { id: mealTypeId },
      data: {
        deletedAt: new Date(),
      },
      select: mealTypeSelect,
    });

    return this.toEntity(record);
  }

  private async findOwnedUserMealType(
    profileId: string,
    mealTypeId: string,
  ): Promise<MealTypeRecord | null> {
    return this.prisma.mealType.findFirst({
      where: {
        id: mealTypeId,
        ...userMealTypeWhere(profileId),
      },
      select: mealTypeSelect,
    });
  }

  private toEntity(record: MealTypeRecord): MealTypeEntity {
    return {
      id: record.id,
      name: record.name,
      sortOrder: record.sortOrder,
    };
  }
}
