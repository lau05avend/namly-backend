import { Module } from '@nestjs/common';
import { MeasurementUnitsService } from './application/measurement-units.service';
import { MeasurementUnitRepository } from './infrastructure/repositories/measurement-unit.repository';
import { MeasurementUnitsController } from './presentation/controllers/measurement-units.controller';

@Module({
  controllers: [MeasurementUnitsController],
  providers: [MeasurementUnitsService, MeasurementUnitRepository],
  exports: [MeasurementUnitsService],
})
export class MeasurementUnitsModule {}
