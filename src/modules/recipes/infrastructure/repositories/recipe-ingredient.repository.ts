import { Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import type { CreateRecipeIngredientParams } from '../../domain/interfaces/create-recipe-ingredient-params.interface';
import type { UpdateRecipeIngredientParams } from '../../domain/interfaces/update-recipe-ingredient-params.interface';

@Injectable()
export class RecipeIngredientRepository {
  async createMany(
    tx: Prisma.TransactionClient,
    recipeId: string,
    ingredients: readonly CreateRecipeIngredientParams[],
  ): Promise<void> {
    if (ingredients.length === 0) {
      return;
    }

    await tx.recipeIngredient.createMany({
      data: ingredients.map((ingredient) => ({
        recipeId,
        name: ingredient.name,
        quantity: this.toDecimal(ingredient.quantity),
        unitId: ingredient.unitId ?? null,
      })),
    });
  }

  async sync(
    tx: Prisma.TransactionClient,
    recipeId: string,
    ingredients: readonly UpdateRecipeIngredientParams[],
  ): Promise<void> {
    const existing = await tx.recipeIngredient.findMany({
      where: { recipeId },
      select: { id: true },
    });

    const payloadIds = new Set(
      ingredients.filter((item) => !!item.id).map((item) => item.id as string),
    );

    const idsToDelete = existing.filter((item) => !payloadIds.has(item.id)).map((item) => item.id);

    if (idsToDelete.length > 0) {
      await tx.recipeIngredient.deleteMany({
        where: { id: { in: idsToDelete }, recipeId },
      });
    }

    for (const ingredient of ingredients) {
      if (ingredient.id) {
        await tx.recipeIngredient.update({
          where: { id: ingredient.id, recipeId },
          data: {
            name: ingredient.name,
            quantity: this.toDecimal(ingredient.quantity),
            unitId: ingredient.unitId ?? null,
          },
        });
      } else {
        await tx.recipeIngredient.create({
          data: {
            recipeId,
            name: ingredient.name,
            quantity: this.toDecimal(ingredient.quantity),
            unitId: ingredient.unitId ?? null,
          },
        });
      }
    }
  }

  private toDecimal(value: number | null | undefined): Prisma.Decimal | null {
    if (value === undefined || value === null) {
      return null;
    }

    return new Prisma.Decimal(value);
  }
}
