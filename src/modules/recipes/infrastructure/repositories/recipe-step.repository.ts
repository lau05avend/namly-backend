import { Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import type { CreateRecipeStepParams } from '../../domain/interfaces/create-recipe-step-params.interface';
import type { UpdateRecipeStepParams } from '../../domain/interfaces/update-recipe-step-params.interface';

@Injectable()
export class RecipeStepRepository {
  async createMany(
    tx: Prisma.TransactionClient,
    recipeId: string,
    steps: readonly CreateRecipeStepParams[],
  ): Promise<void> {
    for (const step of steps) {
      await tx.recipeStep.create({
        data: {
          recipeId,
          stepOrder: step.stepOrder,
          description: step.description,
          durationMinutes: step.durationMinutes ?? null,
        },
      });
    }
  }

  async sync(
    tx: Prisma.TransactionClient,
    recipeId: string,
    steps: readonly UpdateRecipeStepParams[],
  ): Promise<void> {
    const existing = await tx.recipeStep.findMany({
      where: { recipeId },
      select: { id: true },
    });

    const payloadIds = new Set(steps.filter((item) => !!item.id).map((item) => item.id as string));

    const idsToDelete = existing.filter((item) => !payloadIds.has(item.id)).map((item) => item.id);

    if (idsToDelete.length > 0) {
      await tx.recipeStep.deleteMany({
        where: { id: { in: idsToDelete }, recipeId },
      });
    }

    for (const step of steps) {
      if (step.id) {
        await tx.recipeStep.update({
          where: { id: step.id, recipeId },
          data: {
            stepOrder: step.stepOrder,
            description: step.description,
            durationMinutes: step.durationMinutes ?? null,
          },
        });
      } else {
        await tx.recipeStep.create({
          data: {
            recipeId,
            stepOrder: step.stepOrder,
            description: step.description,
            durationMinutes: step.durationMinutes ?? null,
          },
        });
      }
    }
  }
}
