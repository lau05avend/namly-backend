import { Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import type { MeasurementUnitEntity } from '@modules/measurement-units/domain/entities/measurement-unit.entity';
import type { RecipeDetailCoreEntity } from '../../domain/entities/recipe-detail.entity';
import type { RecipeInteractionEntity } from '../../domain/entities/recipe-interaction.entity';
import type { RecipeListItemEntity } from '../../domain/entities/recipe-list-item.entity';
import type { RecipeListFilter } from '../../domain/enums/recipe-list-filter.enum';
import type { CreateRecipeCoreParams } from '../../domain/interfaces/create-recipe-core-params.interface';
import type { UpdateRecipeCoreParams } from '../../domain/interfaces/update-recipe-core-params.interface';
import { resolveRecipeMutationPermissions } from '../../domain/rules/resolve-recipe-mutation-permissions.util';

const notDeleted = { deletedAt: null } as const;

const interactionSelect = {
  rating: true,
  publicComment: true,
  privateNotes: true,
  isFavorite: true,
  isHidden: true,
} as const;

const unitSelect = {
  id: true,
  name: true,
  abbreviation: true,
  category: true,
  isConvertible: true,
  isDefault: true,
} as const;

@Injectable()
export class RecipeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findList(
    profileId: string,
    filter: RecipeListFilter,
    tagIds?: readonly string[],
    folderId?: string,
    title?: string,
  ): Promise<RecipeListItemEntity[]> {
    const where = this.buildListWhere(profileId, filter, tagIds, folderId, title);

    const records = await this.prisma.recipe.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        coverUrl: true,
        profileId: true,
        isSuggested: true,
        isPublic: true,
        updatedAt: true,
        createdAt: true,
        userRecipeInteractions: {
          where: { profileId },
          take: 1,
          select: {
            isFavorite: true,
            isHidden: true,
          },
        },
      },
    });

    if (records.length === 0) {
      return [];
    }

    const averageRatingsByRecipeId = await this.resolveAverageRatingsByRecipeId(
      records.map((record) => record.id),
    );

    return records.map((record) =>
      this.toListItem(record, profileId, averageRatingsByRecipeId.get(record.id) ?? null),
    );
  }

  async findDetailById(recipeId: string, profileId: string): Promise<RecipeDetailCoreEntity | null> {
    const record = await this.prisma.recipe.findFirst({
      where: {
        id: recipeId,
        ...this.buildAccessibleWhere(profileId),
      },
      select: this.detailSelect(profileId),
    });

    if (!record) {
      return null;
    }

    return this.toDetail(record, profileId);
  }

  async findOwnedById(
    recipeId: string,
    profileId: string,
  ): Promise<{ isSuggested: boolean } | null> {
    return this.prisma.recipe.findFirst({
      where: {
        id: recipeId,
        profileId,
        ...notDeleted,
      },
      select: { isSuggested: true },
    });
  }

  async isOwnedInTransaction(
    tx: Prisma.TransactionClient,
    recipeId: string,
    profileId: string,
  ): Promise<boolean> {
    const record = await tx.recipe.findFirst({
      where: { id: recipeId, profileId, ...notDeleted },
      select: { id: true },
    });

    return record !== null;
  }

  async createRecord(
    tx: Prisma.TransactionClient,
    profileId: string,
    params: CreateRecipeCoreParams,
  ): Promise<string> {
    const recipe = await tx.recipe.create({
      data: {
        profileId,
        title: params.title,
        description: params.description ?? null,
        coverUrl: params.coverUrl ?? null,
        isPublic: params.isPublic ?? false,
        isSuggested: false,
      },
      select: { id: true },
    });

    return recipe.id;
  }

  async updateRecord(
    tx: Prisma.TransactionClient,
    recipeId: string,
    params: UpdateRecipeCoreParams,
  ): Promise<void> {
    await tx.recipe.update({
      where: { id: recipeId },
      data: {
        ...(params.title && { title: params.title }),
        ...(params.description !== undefined && { description: params.description }),
        ...(params.coverUrl !== undefined && { coverUrl: params.coverUrl }),
        ...(params.isPublic !== undefined && { isPublic: params.isPublic }),
        updatedAt: new Date(),
      },
    });
  }

  async softDelete(recipeId: string, profileId: string): Promise<boolean> {
    const result = await this.prisma.recipe.update({
      where: {
        id: recipeId,
        profileId,
        isSuggested: false,
        ...notDeleted,
      },
      data: { deletedAt: new Date() },
    });

    return result !== null;
  }

  async isAccessible(recipeId: string, profileId: string): Promise<boolean> {
    const count = await this.prisma.recipe.count({
      where: {
        id: recipeId,
        ...this.buildAccessibleWhere(profileId),
      },
    });

    return count > 0;
  }

  private buildAccessibleWhere(profileId: string): Prisma.RecipeWhereInput {
    return {
      ...notDeleted,
      OR: [{ isPublic: true }, { isSuggested: true }, { profileId }],
    };
  }

  private buildListWhere(
    profileId: string,
    filter: RecipeListFilter,
    tagIds?: readonly string[],
    folderId?: string,
    title?: string,
  ): Prisma.RecipeWhereInput {
    let filterWhere: Prisma.RecipeWhereInput;

    switch (filter) {
      case 'suggested':
        filterWhere = { ...notDeleted, isSuggested: true };
        break;
      case 'public':
        filterWhere = { ...notDeleted, isPublic: true };
        break;
      case 'own':
        filterWhere = { ...notDeleted, profileId, isSuggested: false };
        break;
      case 'favorites':
        filterWhere = {
          ...notDeleted,
          userRecipeInteractions: {
            some: { profileId, isFavorite: true, isHidden: false },
          },
        };
        break;
      case 'hidden':
        filterWhere = {
          ...notDeleted,
          userRecipeInteractions: {
            some: { profileId, isHidden: true },
          },
        };
        break;
      case 'all':
      default:
        filterWhere = this.buildAccessibleWhere(profileId);
        break;
    }

    const conditions: Prisma.RecipeWhereInput[] = [filterWhere];

    if (folderId) {
      conditions.push({
        folderItems: { some: { folderId } },
      });
    }

    if (tagIds && tagIds.length > 0) {
      conditions.push(
        ...tagIds.map((tagId) => ({
          tagLinks: { some: { tagId } },
        })),
      );
    }

    if (title) {
      conditions.push({
        title: {
          contains: title,
          mode: 'insensitive',
        },
      });
    }

    if (conditions.length === 1) {
      return filterWhere;
    }

    return { AND: conditions };
  }

  private detailSelect(profileId: string) {
    return {
      id: true,
      profileId: true,
      isSuggested: true,
      title: true,
      description: true,
      coverUrl: true,
      isPublic: true,
      createdAt: true,
      updatedAt: true,
      ingredients: {
        orderBy: { name: 'asc' as const },
        select: {
          id: true,
          name: true,
          quantity: true,
          unitId: true,
          measurementUnit: {
            select: unitSelect,
          },
        },
      },
      steps: {
        orderBy: { stepOrder: 'asc' as const },
        select: {
          id: true,
          stepOrder: true,
          description: true,
          durationMinutes: true,
        },
      },
      tagLinks: {
        where: { tag: { deletedAt: null } },
        select: {
          tag: {
            select: {
              id: true,
              category: true,
              name: true,
              iconName: true,
            },
          },
        },
      },
      userRecipeInteractions: {
        where: { profileId },
        orderBy: { createdAt: 'asc' as const },
        take: 1,
        select: interactionSelect,
      },
    };
  }

  private async resolveAverageRatingsByRecipeId(
    recipeIds: readonly string[],
  ): Promise<Map<string, number>> {
    const aggregates = await this.prisma.userRecipeInteraction.groupBy({
      by: ['recipeId'],
      where: {
        recipeId: { in: [...recipeIds] },
        rating: { not: null },
      },
      _avg: { rating: true },
    });

    const averageRatingsByRecipeId = new Map<string, number>();

    for (const aggregate of aggregates) {
      const averageRating = aggregate._avg.rating;

      if (averageRating !== null) {
        averageRatingsByRecipeId.set(aggregate.recipeId, Math.round(averageRating * 10) / 10);
      }
    }

    return averageRatingsByRecipeId;
  }

  private toListItem(
    record: {
      id: string;
      title: string;
      coverUrl: string | null;
      profileId: string | null;
      isSuggested: boolean;
      isPublic: boolean;
      updatedAt: Date;
      createdAt: Date;
      userRecipeInteractions: Array<{
        isFavorite: boolean;
        isHidden: boolean;
      }>;
    },
    viewerProfileId: string,
    averageRating: number | null,
  ): RecipeListItemEntity {
    const interaction = record.userRecipeInteractions[0];

    return {
      id: record.id,
      title: record.title,
      coverUrl: record.coverUrl,
      rating: averageRating,
      isFavorite: interaction?.isFavorite ?? false,
      isHidden: interaction?.isHidden ?? false,
      isSuggested: record.isSuggested,
      isPublic: record.isPublic && record.profileId !== viewerProfileId,
      updatedAt: record.updatedAt,
      createdAt: record.createdAt,
    };
  }

  private toDetail(
    record: {
      id: string;
      profileId: string | null;
      isSuggested: boolean;
      title: string;
      description: string | null;
      coverUrl: string | null;
      isPublic: boolean;
      createdAt: Date;
      updatedAt: Date;
      ingredients: Array<{
        id: string;
        name: string;
        quantity: Prisma.Decimal | null;
        unitId: string | null;
        measurementUnit: {
          id: string;
          name: string;
          abbreviation: string;
          category: string;
          isConvertible: boolean;
          isDefault: boolean;
        } | null;
      }>;
      steps: Array<{
        id: string;
        stepOrder: number;
        description: string;
        durationMinutes: number | null;
      }>;
      tagLinks: Array<{
        tag: {
          id: string;
          category: string;
          name: string;
          iconName: string | null;
        };
      }>;
      userRecipeInteractions: Array<{
        rating: number | null;
        publicComment: string | null;
        privateNotes: string | null;
        isFavorite: boolean;
        isHidden: boolean;
      }>;
    },
    viewerProfileId: string,
  ): RecipeDetailCoreEntity {
    const interactionRecord = record.userRecipeInteractions[0];
    const { canEdit, canDelete } = resolveRecipeMutationPermissions(record, viewerProfileId);

    return {
      recipe: {
        id: record.id,
        title: record.title,
        description: record.description,
        coverUrl: record.coverUrl,
        isPublic: record.isPublic,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },
      ingredients: record.ingredients.map((ingredient) => ({
        id: ingredient.id,
        name: ingredient.name,
        quantity: ingredient.quantity?.toNumber() ?? null,
        unitId: ingredient.unitId,
        unit: ingredient.measurementUnit ? this.toUnitEntity(ingredient.measurementUnit) : null,
      })),
      steps: record.steps.map((step) => ({
        id: step.id,
        stepOrder: step.stepOrder,
        description: step.description,
        durationMinutes: step.durationMinutes,
      })),
      tags: record.tagLinks.map((link) => ({
        id: link.tag.id,
        category: link.tag.category,
        name: link.tag.name,
        iconName: link.tag.iconName,
      })),
      interaction: interactionRecord
        ? {
            rating: interactionRecord.rating,
            publicComment: interactionRecord.publicComment,
            privateNotes: interactionRecord.privateNotes,
            isFavorite: interactionRecord.isFavorite,
            isHidden: interactionRecord.isHidden,
          }
        : this.defaultInteraction(),
      canEdit,
      canDelete,
    };
  }

  private toUnitEntity(record: {
    id: string;
    name: string;
    abbreviation: string;
    category: string;
    isConvertible: boolean;
    isDefault: boolean;
  }): MeasurementUnitEntity {
    return {
      id: record.id,
      name: record.name,
      abbreviation: record.abbreviation,
      category: record.category,
      isConvertible: record.isConvertible,
      isDefault: record.isDefault,
    };
  }

  private defaultInteraction(): RecipeInteractionEntity {
    return {
      rating: null,
      publicComment: null,
      privateNotes: null,
      isFavorite: false,
      isHidden: false,
    };
  }
}
