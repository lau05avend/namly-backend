import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

export type TagKeywordRecord = {
  tagId: string;
  tagName: string;
  keyword: string;
};

@Injectable()
export class TagKeywordRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findKeywordsByTagIds(tagIds: readonly string[]): Promise<TagKeywordRecord[]> {
    if (tagIds.length === 0) {
      return [];
    }

    const records = await this.prisma.tagKeyword.findMany({
      where: {
        tagId: { in: [...tagIds] },
        tag: {
          deletedAt: null,
        },
      },
      select: {
        tagId: true,
        keyword: true,
        tag: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [{ tagId: 'asc' }, { keyword: 'asc' }],
    });

    return records.map((record) => ({
      tagId: record.tagId,
      tagName: record.tag.name,
      keyword: record.keyword,
    }));
  }
}
