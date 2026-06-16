import { MeasurementUnitMapper } from '@modules/measurement-units/presentation/mappers/measurement-unit.mapper';
import type { RecipeDetailEntity } from '../../domain/entities/recipe-detail.entity';
import type { RecipeInteractionEntity } from '../../domain/entities/recipe-interaction.entity';
import type { RecipeListItemEntity } from '../../domain/entities/recipe-list-item.entity';
import { RecipeDetailDto } from '../dto/recipe-detail.dto';
import { RecipeIngredientDto } from '../dto/recipe-ingredient.dto';
import { RecipeInteractionDto } from '../dto/recipe-interaction.dto';
import { RecipeListItemDto } from '../dto/recipe-list-item.dto';
import { RecipeStepDto } from '../dto/recipe-step.dto';
import { RecipeSummaryDto } from '../dto/recipe-summary.dto';
import { RecipeTagDto } from '../dto/recipe-tag.dto';

export class RecipeMapper {
  static toListItemDto(entity: RecipeListItemEntity): RecipeListItemDto {
    const dto = new RecipeListItemDto();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.coverUrl = entity.coverUrl;
    dto.rating = entity.rating;
    dto.isFavorite = entity.isFavorite;
    dto.isHidden = entity.isHidden;
    dto.isSuggested = entity.isSuggested;
    dto.isPublic = entity.isPublic;
    dto.updatedAt = entity.updatedAt;
    dto.createdAt = entity.createdAt;
    return dto;
  }

  static toListItemDtoList(entities: readonly RecipeListItemEntity[]): RecipeListItemDto[] {
    return entities.map((entity) => this.toListItemDto(entity));
  }

  static toDetailDto(entity: RecipeDetailEntity): RecipeDetailDto {
    const dto = new RecipeDetailDto();
    dto.recipe = this.toSummaryDto(entity.recipe);
    dto.ingredients = entity.ingredients.map((ingredient) => this.toIngredientDto(ingredient));
    dto.steps = entity.steps.map((step) => this.toStepDto(step));
    dto.tags = entity.tags.map((tag) => this.toTagDto(tag));
    dto.interaction = this.toInteractionDto(entity.interaction);
    return dto;
  }

  static toInteractionDto(entity: RecipeInteractionEntity): RecipeInteractionDto {
    const dto = new RecipeInteractionDto();
    dto.rating = entity.rating;
    dto.publicComment = entity.publicComment;
    dto.privateNotes = entity.privateNotes;
    dto.isFavorite = entity.isFavorite;
    dto.isHidden = entity.isHidden;
    return dto;
  }

  private static toSummaryDto(entity: RecipeDetailEntity['recipe']): RecipeSummaryDto {
    const dto = new RecipeSummaryDto();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.description = entity.description;
    dto.coverUrl = entity.coverUrl;
    dto.isPublic = entity.isPublic;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }

  private static toIngredientDto(
    entity: RecipeDetailEntity['ingredients'][number],
  ): RecipeIngredientDto {
    const dto = new RecipeIngredientDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.quantity = entity.quantity;
    dto.unitId = entity.unitId;
    dto.unit = entity.unit ? MeasurementUnitMapper.toDto(entity.unit) : null;
    return dto;
  }

  private static toStepDto(entity: RecipeDetailEntity['steps'][number]): RecipeStepDto {
    const dto = new RecipeStepDto();
    dto.id = entity.id;
    dto.stepOrder = entity.stepOrder;
    dto.description = entity.description;
    dto.durationMinutes = entity.durationMinutes;
    return dto;
  }

  private static toTagDto(entity: RecipeDetailEntity['tags'][number]): RecipeTagDto {
    const dto = new RecipeTagDto();
    dto.id = entity.id;
    dto.category = entity.category;
    dto.name = entity.name;
    dto.iconName = entity.iconName;
    return dto;
  }
}
