import { Injectable, NotFoundException } from '@nestjs/common';
import type { MeasurementUnitEntity } from '../domain/entities/measurement-unit.entity';
import { MeasurementUnitRepository } from '../infrastructure/repositories/measurement-unit.repository';

@Injectable()
export class MeasurementUnitsService {
  constructor(private readonly measurementUnitRepository: MeasurementUnitRepository) {}

  getActiveUnits(): Promise<MeasurementUnitEntity[]> {
    return this.measurementUnitRepository.findAllActive();
  }

  async getActiveUnitById(unitId: string): Promise<MeasurementUnitEntity> {
    const unit = await this.measurementUnitRepository.findActiveById(unitId);

    if (!unit) {
      throw new NotFoundException('Measurement unit not found');
    }

    return unit;
  }
}
