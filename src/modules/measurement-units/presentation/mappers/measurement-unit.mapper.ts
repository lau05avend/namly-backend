import type { MeasurementUnitEntity } from '../../domain/entities/measurement-unit.entity';
import { MeasurementUnitDto } from '../dto/measurement-unit.dto';

export class MeasurementUnitMapper {
  static toDto(entity: MeasurementUnitEntity): MeasurementUnitDto {
    const dto = new MeasurementUnitDto();

    dto.id = entity.id;
    dto.name = entity.name;
    dto.abbreviation = entity.abbreviation;
    dto.category = entity.category;
    dto.isConvertible = entity.isConvertible;
    dto.isDefault = entity.isDefault;

    return dto;
  }

  static toDtoList(entities: readonly MeasurementUnitEntity[]): MeasurementUnitDto[] {
    return entities.map((entity) => this.toDto(entity));
  }
}
