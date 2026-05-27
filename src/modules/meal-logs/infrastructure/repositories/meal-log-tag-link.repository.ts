import { Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';

@Injectable()
export class MealLogTagLinkRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMany(
    tx: Prisma.TransactionClient,
    mealLogId: string,
    tagIds: readonly string[],
  ): Promise<void> {
    if (tagIds.length === 0) {
      return;
    }

    await tx.mealLogTagLink.createMany({
      data: tagIds.map((tagId) => ({ mealLogId, tagId })),
      skipDuplicates: true,
    });
  }

  async sync(
    tx: Prisma.TransactionClient,
    mealLogId: string,
    tagIds: readonly string[],
  ): Promise<void> {
    const existing = await tx.mealLogTagLink.findMany({
      where: { mealLogId },
      select: { tagId: true },
    });

    const existingTagIds = new Set(existing.map((link) => link.tagId));
    const desiredTagIds = new Set(tagIds);

    const tagIdsToDelete = [...existingTagIds].filter((tagId) => !desiredTagIds.has(tagId));

    if (tagIdsToDelete.length > 0) {
      await tx.mealLogTagLink.deleteMany({
        where: {
          mealLogId,
          tagId: { in: tagIdsToDelete },
        },
      });
    }

    const tagIdsToCreate = [...desiredTagIds].filter((tagId) => !existingTagIds.has(tagId));

    if (tagIdsToCreate.length > 0) {
      await tx.mealLogTagLink.createMany({
        data: tagIdsToCreate.map((tagId) => ({ mealLogId, tagId })),
        skipDuplicates: true,
      });
    }
  }

  async deleteAllForMealLog(tx: Prisma.TransactionClient, mealLogId: string): Promise<void> {
    await tx.mealLogTagLink.deleteMany({ where: { mealLogId } });
  }
}
