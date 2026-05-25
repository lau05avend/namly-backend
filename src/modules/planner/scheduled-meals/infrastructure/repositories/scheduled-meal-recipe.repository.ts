import { Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

@Injectable()
export class ScheduledMealRecipeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMany(
    tx: Prisma.TransactionClient,
    scheduledMealId: string,
    recipeIds: readonly string[],
  ): Promise<void> {
    if (recipeIds.length === 0) {
      return;
    }

    await tx.scheduledMealRecipe.createMany({
      data: recipeIds.map((recipeId, index) => ({
        scheduledMealId,
        recipeId,
        sortOrder: index + 1,
      })),
    });
  }

  async deleteAllForScheduledMeal(
    tx: Prisma.TransactionClient,
    scheduledMealId: string,
  ): Promise<void> {
    await tx.scheduledMealRecipe.deleteMany({ where: { scheduledMealId } });
  }

  async sync(
    tx: Prisma.TransactionClient,
    scheduledMealId: string,
    recipeIds: readonly string[],
  ): Promise<void> {
    const existing = await tx.scheduledMealRecipe.findMany({
      where: { scheduledMealId },
      select: { recipeId: true },
    });

    const desiredRecipeIds = new Set(recipeIds);
    const existingRecipeIds = new Set(existing.map((item) => item.recipeId));

    const recipeIdsToDelete = [...existingRecipeIds].filter(
      (recipeId) => !desiredRecipeIds.has(recipeId),
    );

    if (recipeIdsToDelete.length > 0) {
      await tx.scheduledMealRecipe.deleteMany({
        where: {
          scheduledMealId,
          recipeId: { in: recipeIdsToDelete },
        },
      });
    }

    for (let index = 0; index < recipeIds.length; index += 1) {
      const recipeId = recipeIds[index];
      const sortOrder = index + 1;

      if (existingRecipeIds.has(recipeId)) {
        await tx.scheduledMealRecipe.updateMany({
          where: { scheduledMealId, recipeId },
          data: { sortOrder },
        });
      } else {
        await tx.scheduledMealRecipe.create({
          data: { scheduledMealId, recipeId, sortOrder },
        });
      }
    }
  }
}
