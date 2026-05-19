import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CurrentProfileId } from '@common/decorators/current-profile-id.decorator';
import { RecipeInteractionsService } from '../../application/recipe-interactions.service';
import { RecipeInteractionDto } from '../dto/recipe-interaction.dto';
import { UpsertRecipeInteractionDto } from '../dto/upsert-recipe-interaction.dto';
import { RecipeMapper } from '../mappers/recipe.mapper';

@Controller('recipes/:id/interactions')
export class RecipeInteractionsController {
  constructor(private readonly recipeInteractionsService: RecipeInteractionsService) {}

  @Get()
  async getInteraction(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) recipeId: string,
  ): Promise<RecipeInteractionDto> {
    const interaction = await this.recipeInteractionsService.getInteraction(recipeId, profileId);

    return RecipeMapper.toInteractionDto(interaction);
  }

  @Post()
  async createInteraction(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) recipeId: string,
    @Body() body: UpsertRecipeInteractionDto,
  ): Promise<RecipeInteractionDto> {
    const interaction = await this.recipeInteractionsService.upsertInteraction(
      recipeId,
      profileId,
      body,
    );

    return RecipeMapper.toInteractionDto(interaction);
  }

  @Patch()
  async patchInteraction(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) recipeId: string,
    @Body() body: UpsertRecipeInteractionDto,
  ): Promise<RecipeInteractionDto> {
    const interaction = await this.recipeInteractionsService.upsertInteraction(
      recipeId,
      profileId,
      body,
    );

    return RecipeMapper.toInteractionDto(interaction);
  }
}
