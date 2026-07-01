import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

@Injectable()
export class TagReadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findNamesByIds(tagIds: readonly string[]): Promise<Map<string, string>> {
    if (tagIds.length === 0) {
      return new Map();
    }

    const records = await this.prisma.tag.findMany({
      where: {
        id: { in: [...tagIds] },
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return new Map(records.map((record) => [record.id, record.name]));
  }
}
