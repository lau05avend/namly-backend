import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ApiProtectedTag } from '@/docs/swagger/decorators/api-protected.decorator';
import { ApiStandardMutationResponses } from '@/docs/swagger/decorators/api-standard-responses.decorator';
import { MeasurementUnitsService } from '../../application/measurement-units.service';
import { MeasurementUnitDto } from '../dto/measurement-unit.dto';
import { MeasurementUnitMapper } from '../mappers/measurement-unit.mapper';

@ApiProtectedTag('Measurement Units')
@Controller('measurement-units')
export class MeasurementUnitsController {
  constructor(private readonly measurementUnitsService: MeasurementUnitsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar unidades de medida activas' })
  @ApiOkResponse({ type: MeasurementUnitDto, isArray: true })
  @ApiStandardMutationResponses()
  async listActiveUnits(): Promise<MeasurementUnitDto[]> {
    const units = await this.measurementUnitsService.getActiveUnits();

    return MeasurementUnitMapper.toDtoList(units);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener unidad de medida activa por ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: MeasurementUnitDto })
  @ApiStandardMutationResponses()
  async getActiveUnit(@Param('id', ParseUUIDPipe) unitId: string): Promise<MeasurementUnitDto> {
    const unit = await this.measurementUnitsService.getActiveUnitById(unitId);

    return MeasurementUnitMapper.toDto(unit);
  }
}
