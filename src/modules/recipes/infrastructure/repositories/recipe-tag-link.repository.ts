import { Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';

@Injectable()
export class RecipeTagLinkRepository {
  async createMany(
    tx: Prisma.TransactionClient,
    recipeId: string,
    tagIds: readonly string[],
  ): Promise<void> {
    if (tagIds.length === 0) {
      return;
    }

    await tx.recipeTagLink.createMany({
      data: tagIds.map((tagId) => ({ recipeId, tagId })),
      skipDuplicates: true,
    });
  }

  async sync(
    tx: Prisma.TransactionClient,
    recipeId: string,
    tagIds: readonly string[],
  ): Promise<void> {
    const existing = await tx.recipeTagLink.findMany({
      where: { recipeId },
      select: { tagId: true },
    });

    const existingTagIds = new Set(existing.map((link) => link.tagId));
    const desiredTagIds = new Set(tagIds);

    const tagIdsToDelete = [...existingTagIds].filter((tagId) => !desiredTagIds.has(tagId));

    if (tagIdsToDelete.length > 0) {
      await tx.recipeTagLink.deleteMany({
        where: {
          recipeId,
          tagId: { in: tagIdsToDelete },
        },
      });
    }

    const tagIdsToCreate = [...desiredTagIds].filter((tagId) => !existingTagIds.has(tagId));

    if (tagIdsToCreate.length > 0) {
      await tx.recipeTagLink.createMany({
        data: tagIdsToCreate.map((tagId) => ({ recipeId, tagId })),
        skipDuplicates: true,
      });
    }
  }
}
