import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import type { MeasurementUnitEntity } from '../../domain/entities/measurement-unit.entity';

const unitSelect = {
  id: true,
  name: true,
  abbreviation: true,
  category: true,
  isConvertible: true,
  isDefault: true,
} as const;

@Injectable()
export class MeasurementUnitRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllActive(): Promise<MeasurementUnitEntity[]> {
    const records = await this.prisma.measurementUnit.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
      select: unitSelect,
    });

    return records.map((record) => this.toEntity(record));
  }

  async findActiveById(unitId: string): Promise<MeasurementUnitEntity | null> {
    const record = await this.prisma.measurementUnit.findFirst({
      where: { id: unitId, isActive: true },
      select: unitSelect,
    });

    if (!record) {
      return null;
    }

    return this.toEntity(record);
  }

  private toEntity(record: {
    id: string;
    name: string;
    abbreviation: string;
    category: string;
    isConvertible: boolean;
    isDefault: boolean;
  }): MeasurementUnitEntity {
    return {
      id: record.id,
      name: record.name,
      abbreviation: record.abbreviation,
      category: record.category,
      isConvertible: record.isConvertible,
      isDefault: record.isDefault,
    };
  }
}
