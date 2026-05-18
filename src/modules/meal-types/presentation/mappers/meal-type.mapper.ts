import type { MealTypeEntity } from '../../domain/entities/meal-type.entity';
import { MealTypeDto } from '../dto/meal-type.dto';

export class MealTypeMapper {
  static toDto(entity: MealTypeEntity): MealTypeDto {
    const dto = new MealTypeDto();

    dto.id = entity.id;
    dto.name = entity.name;
    dto.sortOrder = entity.sortOrder;

    return dto;
  }

  static toDtoList(entities: readonly MealTypeEntity[]): MealTypeDto[] {
    return entities.map((entity) => this.toDto(entity));
  }
}
