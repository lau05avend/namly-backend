import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CurrentProfileId } from '@common/decorators/current-profile-id.decorator';
import { ApiProtectedTag } from '@/docs/swagger/decorators/api-protected.decorator';
import { ApiUuidParam } from '@/docs/swagger/decorators/api-uuid-param.decorator';
import { ApiStandardMutationResponses } from '@/docs/swagger/decorators/api-standard-responses.decorator';
import { SwaggerExamples } from '@/docs/swagger/swagger.examples';
import { RecipeInteractionsService } from '../../application/recipe-interactions.service';
import { RecipeInteractionDto } from '../dto/recipe-interaction.dto';
import { UpsertRecipeInteractionDto } from '../dto/upsert-recipe-interaction.dto';
import { RecipeMapper } from '../mappers/recipe.mapper';

@ApiProtectedTag('Recipe Interactions')
@Controller('recipes/:id/interactions')
export class RecipeInteractionsController {
  constructor(private readonly recipeInteractionsService: RecipeInteractionsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener interacción del usuario con una receta' })
  @ApiUuidParam('id', 'ID de la receta', SwaggerExamples.uuid.recipe)
  @ApiOkResponse({ type: RecipeInteractionDto })
  @ApiStandardMutationResponses()
  async getInteraction(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) recipeId: string,
  ): Promise<RecipeInteractionDto> {
    const interaction = await this.recipeInteractionsService.getInteraction(recipeId, profileId);

    return RecipeMapper.toInteractionDto(interaction);
  }

  @Post()
  @ApiOperation({ summary: 'Crear o reemplazar interacción con una receta' })
  @ApiUuidParam('id', 'ID de la receta', SwaggerExamples.uuid.recipe)
  @ApiOkResponse({ type: RecipeInteractionDto })
  @ApiStandardMutationResponses()
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
  @ApiOperation({ summary: 'Actualizar interacción con una receta' })
  @ApiUuidParam('id', 'ID de la receta', SwaggerExamples.uuid.recipe)
  @ApiOkResponse({ type: RecipeInteractionDto })
  @ApiStandardMutationResponses()
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
