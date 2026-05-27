import { Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';

@Injectable()
export class MealLogRecipeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMany(
    tx: Prisma.TransactionClient,
    mealLogId: string,
    recipeIds: readonly string[],
  ): Promise<void> {
    if (recipeIds.length === 0) {
      return;
    }

    await tx.meal_log_recipes.createMany({
      data: recipeIds.map((recipeId, index) => ({
        meal_log_id: mealLogId,
        recipe_id: recipeId,
        sort_order: index + 1,
      })),
    });
  }

  async sync(
    tx: Prisma.TransactionClient,
    mealLogId: string,
    recipeIds: readonly string[],
  ): Promise<void> {
    const existing = await tx.meal_log_recipes.findMany({
      where: { meal_log_id: mealLogId },
      select: { recipe_id: true },
    });

    const existingRecipeIds = new Set(existing.map((item) => item.recipe_id));
    const desiredRecipeIds = new Set(recipeIds);

    const recipeIdsToDelete = [...existingRecipeIds].filter(
      (recipeId) => !desiredRecipeIds.has(recipeId),
    );

    if (recipeIdsToDelete.length > 0) {
      await tx.meal_log_recipes.deleteMany({
        where: {
          meal_log_id: mealLogId,
          recipe_id: { in: recipeIdsToDelete },
        },
      });
    }

    for (const [index, recipeId] of recipeIds.entries()) {
      if (existingRecipeIds.has(recipeId)) {
        await tx.meal_log_recipes.updateMany({
          where: {
            meal_log_id: mealLogId,
            recipe_id: recipeId,
          },
          data: { sort_order: index + 1 },
        });
      } else {
        await tx.meal_log_recipes.create({
          data: {
            meal_log_id: mealLogId,
            recipe_id: recipeId,
            sort_order: index + 1,
          },
        });
      }
    }
  }

  async deleteAllForMealLog(tx: Prisma.TransactionClient, mealLogId: string): Promise<void> {
    await tx.meal_log_recipes.deleteMany({ where: { meal_log_id: mealLogId } });
  }
}
