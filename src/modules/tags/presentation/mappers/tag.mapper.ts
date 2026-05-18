import type { TagEntity } from '../../domain/entities/tag.entity';
import { TagDto } from '../dto/tag.dto';

export class TagMapper {
  static toDto(entity: TagEntity): TagDto {
    const dto = new TagDto();

    dto.id = entity.id;
    dto.category = entity.category;
    dto.name = entity.name;
    dto.iconName = entity.iconName;

    return dto;
  }

  static toDtoList(entities: readonly TagEntity[]): TagDto[] {
    return entities.map((entity) => this.toDto(entity));
  }
}
