import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import type { TagEntity } from '../../domain/entities/tag.entity';
import type { CreateTagItemParams } from '../../domain/interfaces/create-tag-item-params.interface';
import type { UpdateTagParams } from '../../domain/interfaces/update-tag-params.interface';

const tagSelect = {
  id: true,
  category: true,
  name: true,
  iconName: true,
} as const;

type TagRecord = {
  id: string;
  category: string;
  name: string;
  iconName: string | null;
};

const systemTagWhere = (category: string) =>
  ({
    profileId: null,
    category,
    isSystemDefined: true,
    deletedAt: null,
    isVisible: true,
  }) as const;

const userTagWhere = (profileId: string, category: string) =>
  ({
    profileId,
    category,
    isSystemDefined: false,
    deletedAt: null,
  }) as const;

@Injectable()
export class TagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findSystemTagsByCategory(category: string): Promise<TagEntity[]> {
    const records = await this.prisma.tag.findMany({
      where: systemTagWhere(category),
      orderBy: { name: 'asc' },
      select: tagSelect,
    });

    return records.map((record) => this.toEntity(record));
  }

  async findUserTagsByCategory(profileId: string, category: string): Promise<TagEntity[]> {
    const records = await this.prisma.tag.findMany({
      where: userTagWhere(profileId, category),
      orderBy: { name: 'asc' },
      select: tagSelect,
    });

    return records.map((record) => this.toEntity(record));
  }

  async ensureUserTagsInitializedForCategory(profileId: string, category: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const existingCount = await tx.tag.count({
        where: userTagWhere(profileId, category),
      });

      if (existingCount > 0) {
        return;
      }

      const systemTags = await tx.tag.findMany({
        where: systemTagWhere(category),
        orderBy: { name: 'asc' },
        select: {
          category: true,
          name: true,
          iconName: true,
        },
      });

      if (systemTags.length === 0) {
        return;
      }

      await tx.tag.createMany({
        data: systemTags.map((systemTag) => ({
          profileId,
          category: systemTag.category,
          name: systemTag.name,
          iconName: systemTag.iconName,
          isSystemDefined: false,
        })),
      });
    });
  }

  async existsUserTagWithNameInCategory(
    profileId: string,
    category: string,
    name: string,
    excludeTagId?: string,
  ): Promise<boolean> {
    const count = await this.prisma.tag.count({
      where: {
        ...userTagWhere(profileId, category),
        name,
        ...(excludeTagId !== undefined && { id: { not: excludeTagId } }),
      },
    });

    return count > 0;
  }

  async createUserTags(
    profileId: string,
    category: string,
    items: readonly CreateTagItemParams[],
  ): Promise<TagEntity[]> {
    return this.prisma.$transaction(async (tx) => {
      const records = await Promise.all(
        items.map((item) =>
          tx.tag.create({
            data: {
              profileId,
              category,
              name: item.name,
              iconName: item.iconName ?? null,
              isSystemDefined: false,
            },
            select: tagSelect,
          }),
        ),
      );

      return records.map((record) => this.toEntity(record));
    });
  }

  async updateUserTag(
    profileId: string,
    tagId: string,
    params: UpdateTagParams,
  ): Promise<TagEntity | null> {
    const owned = await this.findOwnedUserTag(profileId, tagId);

    if (!owned) {
      return null;
    }

    const record = await this.prisma.tag.update({
      where: { id: tagId },
      data: {
        category: params.category,
        name: params.name,
        ...(params.iconName !== undefined && { iconName: params.iconName }),
      },
      select: tagSelect,
    });

    return this.toEntity(record);
  }

  async softDeleteUserTag(profileId: string, tagId: string): Promise<TagEntity | null> {
    const owned = await this.findOwnedUserTag(profileId, tagId);

    if (!owned) {
      return null;
    }

    const record = await this.prisma.tag.update({
      where: { id: tagId },
      data: {
        deletedAt: new Date(),
      },
      select: tagSelect,
    });

    return this.toEntity(record);
  }

  private async findOwnedUserTag(profileId: string, tagId: string): Promise<TagRecord | null> {
    return this.prisma.tag.findFirst({
      where: {
        id: tagId,
        profileId,
        isSystemDefined: false,
        deletedAt: null,
      },
      select: tagSelect,
    });
  }

  private toEntity(record: TagRecord): TagEntity {
    return {
      id: record.id,
      category: record.category,
      name: record.name,
      iconName: record.iconName,
    };
  }
}
