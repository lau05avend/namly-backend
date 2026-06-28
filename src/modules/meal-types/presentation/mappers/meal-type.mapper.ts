import type { MealTypeEntity } from '../../domain/entities/meal-type.entity';
import type { MealTypeListItemEntity } from '../../domain/entities/meal-type-list-item.entity';
import { MealTypeDto } from '../dto/meal-type.dto';

export class MealTypeMapper {
  static toDto(entity: MealTypeEntity): MealTypeDto {
    const dto = new MealTypeDto();

    dto.id = entity.id;
    dto.name = entity.name;
    dto.sortOrder = entity.sortOrder;
    dto.isFrequent = false;

    return dto;
  }

  static toListItemDto(entity: MealTypeListItemEntity): MealTypeDto {
    const dto = new MealTypeDto();

    dto.id = entity.id;
    dto.name = entity.name;
    dto.sortOrder = entity.sortOrder;
    dto.isFrequent = entity.isFrequent;

    return dto;
  }

  static toDtoList(entities: readonly MealTypeEntity[]): MealTypeDto[] {
    return entities.map((entity) => MealTypeMapper.toDto(entity));
  }

  static toListItemDtoList(entities: readonly MealTypeListItemEntity[]): MealTypeDto[] {
    return entities.map((entity) => MealTypeMapper.toListItemDto(entity));
  }
}
