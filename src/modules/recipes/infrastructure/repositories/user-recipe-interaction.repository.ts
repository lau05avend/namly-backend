import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import type { RecipeInteractionEntity } from '../../domain/entities/recipe-interaction.entity';
import type { UpsertRecipeInteractionParams } from '../../domain/interfaces/upsert-recipe-interaction-params.interface';

const interactionSelect = {
  rating: true,
  publicComment: true,
  privateNotes: true,
  isFavorite: true,
  isHidden: true,
} as const;

@Injectable()
export class UserRecipeInteractionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByRecipeAndProfile(
    recipeId: string,
    profileId: string,
  ): Promise<RecipeInteractionEntity | null> {
    const record = await this.prisma.userRecipeInteraction.findFirst({
      where: { recipeId, profileId },
      orderBy: { createdAt: 'asc' },
      select: interactionSelect,
    });

    if (!record) {
      return null;
    }

    return this.toEntity(record);
  }

  async upsert(
    recipeId: string,
    profileId: string,
    params: UpsertRecipeInteractionParams,
  ): Promise<RecipeInteractionEntity> {
    const existing = await this.prisma.userRecipeInteraction.findFirst({
      where: { recipeId, profileId },
      orderBy: { createdAt: 'asc' },
    });

    if (existing) {
      const record = await this.prisma.userRecipeInteraction.update({
        where: { id: existing.id },
        data: {
          ...(params.rating !== undefined && { rating: params.rating }),
          ...(params.publicComment !== undefined && { publicComment: params.publicComment }),
          ...(params.privateNotes !== undefined && { privateNotes: params.privateNotes }),
          ...(params.isFavorite !== undefined && { isFavorite: params.isFavorite }),
          ...(params.isHidden !== undefined && { isHidden: params.isHidden }),
          updatedAt: new Date(),
        },
        select: interactionSelect,
      });

      return this.toEntity(record);
    }

    const record = await this.prisma.userRecipeInteraction.create({
      data: {
        recipeId,
        profileId,
        rating: params.rating ?? null,
        publicComment: params.publicComment ?? null,
        privateNotes: params.privateNotes ?? null,
        isFavorite: params.isFavorite ?? false,
        isHidden: params.isHidden ?? false,
      },
      select: interactionSelect,
    });

    return this.toEntity(record);
  }

  private toEntity(record: {
    rating: number | null;
    publicComment: string | null;
    privateNotes: string | null;
    isFavorite: boolean;
    isHidden: boolean;
  }): RecipeInteractionEntity {
    return {
      rating: record.rating,
      publicComment: record.publicComment,
      privateNotes: record.privateNotes,
      isFavorite: record.isFavorite,
      isHidden: record.isHidden,
    };
  }
}
