import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

@Injectable()
export class RecipeFolderItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findExistingRecipeIds(
    folderId: string,
    recipeIds: readonly string[],
  ): Promise<readonly string[]> {
    const records = await this.prisma.recipeFolderItem.findMany({
      where: {
        folderId,
        recipeId: { in: [...recipeIds] },
      },
      select: { recipeId: true },
    });

    return records.map((record) => record.recipeId);
  }

  async createMany(folderId: string, recipeIds: readonly string[]): Promise<void> {
    if (recipeIds.length === 0) {
      return;
    }

    await this.prisma.recipeFolderItem.createMany({
      data: recipeIds.map((recipeId) => ({ folderId, recipeId })),
    });
  }

  async deleteMany(folderId: string, recipeIds: readonly string[]): Promise<number> {
    if (recipeIds.length === 0) {
      return 0;
    }

    const result = await this.prisma.recipeFolderItem.deleteMany({
      where: {
        folderId,
        recipeId: { in: [...recipeIds] },
      },
    });

    return result.count;
  }
}
