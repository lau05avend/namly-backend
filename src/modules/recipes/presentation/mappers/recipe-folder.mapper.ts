import type { RecipeFolderEntity } from '../../domain/entities/recipe-folder.entity';
import { RecipeFolderDto } from '../dto/recipe-folder.dto';

export class RecipeFolderMapper {
  static toDto(entity: RecipeFolderEntity): RecipeFolderDto {
    const dto = new RecipeFolderDto();

    dto.id = entity.id;
    dto.name = entity.name;
    dto.colorHex = entity.colorHex;
    dto.recipesCount = entity.recipesCount;

    return dto;
  }

  static toDtoList(entities: readonly RecipeFolderEntity[]): RecipeFolderDto[] {
    return entities.map((entity) => this.toDto(entity));
  }
}
