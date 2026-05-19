import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import type { RecipeFolderEntity } from '../../domain/entities/recipe-folder.entity';
import type { CreateRecipeFolderParams } from '../../domain/interfaces/create-recipe-folder-params.interface';
import type { UpdateRecipeFolderParams } from '../../domain/interfaces/update-recipe-folder-params.interface';

const notDeleted = { deletedAt: null } as const;

const folderItemCountWhere = {
  recipe: { deletedAt: null },
} as const;

const folderSelect = {
  id: true,
  name: true,
  colorHex: true,
  _count: {
    select: {
      items: {
        where: folderItemCountWhere,
      },
    },
  },
} as const;

type FolderRecord = {
  id: string;
  name: string;
  colorHex: string | null;
  _count: { items: number };
};

@Injectable()
export class RecipeFolderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByProfileId(profileId: string): Promise<RecipeFolderEntity[]> {
    const records = await this.prisma.recipeFolder.findMany({
      where: { profileId, ...notDeleted },
      orderBy: { name: 'asc' },
      select: folderSelect,
    });

    return records.map((record) => this.toEntity(record));
  }

  async findByIdForProfile(
    folderId: string,
    profileId: string,
  ): Promise<RecipeFolderEntity | null> {
    const record = await this.prisma.recipeFolder.findFirst({
      where: { id: folderId, profileId, ...notDeleted },
      select: folderSelect,
    });

    if (!record) {
      return null;
    }

    return this.toEntity(record);
  }

  async existsWithNameForProfile(
    profileId: string,
    name: string,
    excludeFolderId?: string,
  ): Promise<boolean> {
    const count = await this.prisma.recipeFolder.count({
      where: {
        profileId,
        name,
        ...notDeleted,
        ...(excludeFolderId && { id: { not: excludeFolderId } }),
      },
    });

    return count > 0;
  }

  async create(profileId: string, params: CreateRecipeFolderParams): Promise<RecipeFolderEntity> {
    const record = await this.prisma.recipeFolder.create({
      data: {
        profileId,
        name: params.name,
        colorHex: params.colorHex ?? null,
      },
      select: folderSelect,
    });

    return this.toEntity(record);
  }

  async update(
    folderId: string,
    profileId: string,
    params: UpdateRecipeFolderParams,
  ): Promise<RecipeFolderEntity | null> {
    const owned = await this.prisma.recipeFolder.findFirst({
      where: { id: folderId, profileId, ...notDeleted },
      select: { id: true },
    });

    if (!owned) {
      return null;
    }

    const record = await this.prisma.recipeFolder.update({
      where: { id: folderId },
      data: {
        ...(params.name && { name: params.name }),
        ...(params.colorHex !== undefined && { colorHex: params.colorHex }),
        updatedAt: new Date(),
      },
      select: folderSelect,
    });

    return this.toEntity(record);
  }

  async softDelete(folderId: string, profileId: string): Promise<boolean> {
    const result = await this.prisma.recipeFolder.updateMany({
      where: { id: folderId, profileId, ...notDeleted },
      data: { deletedAt: new Date() },
    });

    return result.count > 0;
  }

  private toEntity(record: FolderRecord): RecipeFolderEntity {
    return {
      id: record.id,
      name: record.name,
      colorHex: record.colorHex,
      recipesCount: record._count.items,
    };
  }
}
