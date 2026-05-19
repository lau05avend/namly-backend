import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { MeasurementUnitsService } from '../../application/measurement-units.service';
import { MeasurementUnitDto } from '../dto/measurement-unit.dto';
import { MeasurementUnitMapper } from '../mappers/measurement-unit.mapper';

@Controller('measurement-units')
export class MeasurementUnitsController {
  constructor(private readonly measurementUnitsService: MeasurementUnitsService) {}

  @Get()
  async listActiveUnits(): Promise<MeasurementUnitDto[]> {
    const units = await this.measurementUnitsService.getActiveUnits();

    return MeasurementUnitMapper.toDtoList(units);
  }

  @Get(':id')
  async getActiveUnit(@Param('id', ParseUUIDPipe) unitId: string): Promise<MeasurementUnitDto> {
    const unit = await this.measurementUnitsService.getActiveUnitById(unitId);

    return MeasurementUnitMapper.toDto(unit);
  }
}
