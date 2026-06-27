import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CurrentProfileId } from '@common/decorators/current-profile-id.decorator';
import { ApiProtectedTag } from '@/docs/swagger/decorators/api-protected.decorator';
import { ApiBodyExample } from '@/docs/swagger/decorators/api-body-example.decorator';
import { ApiUuidParam } from '@/docs/swagger/decorators/api-uuid-param.decorator';
import { ApiStandardMutationResponses } from '@/docs/swagger/decorators/api-standard-responses.decorator';
import { SwaggerExamples, SwaggerRequestExamples } from '@/docs/swagger/swagger.examples';
import { RecipesService } from '../../application/recipes.service';
import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { ListRecipesQueryDto } from '../dto/list-recipes-query.dto';
import { RecipeDetailDto } from '../dto/recipe-detail.dto';
import { RecipeListItemDto } from '../dto/recipe-list-item.dto';
import { UpdateRecipeDto } from '../dto/update-recipe.dto';
import { RecipeMapper } from '../mappers/recipe.mapper';

@ApiProtectedTag('Recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar recetas del usuario con filtros opcionales',
    description:
      'Cada ítem incluye el rating promedio de todas las interacciones con valoración. ' +
      'La valoración personal del usuario se obtiene en el detalle (`interaction.rating`).',
  })
  @ApiOkResponse({ type: RecipeListItemDto, isArray: true })
  @ApiStandardMutationResponses()
  async listRecipes(
    @CurrentProfileId() profileId: string,
    @Query() query: ListRecipesQueryDto,
  ): Promise<RecipeListItemDto[]> {
    const recipes = await this.recipesService.listRecipes(
      profileId,
      query.filter,
      query.tags,
      query.folderId,
      query.title,
    );

    return RecipeMapper.toListItemDtoList(recipes);
  }

  @Post()
  @ApiBodyExample(CreateRecipeDto, SwaggerRequestExamples.createRecipe)
  @ApiOperation({ summary: 'Crear receta' })
  @ApiCreatedResponse({ type: RecipeDetailDto })
  @ApiStandardMutationResponses()
  async createRecipe(
    @CurrentProfileId() profileId: string,
    @Body() body: CreateRecipeDto,
  ): Promise<RecipeDetailDto> {
    const recipe = await this.recipesService.createRecipe(profileId, body);

    return RecipeMapper.toDetailDto(recipe);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de receta' })
  @ApiUuidParam('id', 'ID de la receta', SwaggerExamples.uuid.recipe)
  @ApiOkResponse({ type: RecipeDetailDto })
  @ApiStandardMutationResponses()
  async getRecipe(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) recipeId: string,
  ): Promise<RecipeDetailDto> {
    const recipe = await this.recipesService.getRecipeById(recipeId, profileId);

    return RecipeMapper.toDetailDto(recipe);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar receta' })
  @ApiUuidParam('id', 'ID de la receta', SwaggerExamples.uuid.recipe)
  @ApiOkResponse({ type: RecipeDetailDto })
  @ApiStandardMutationResponses()
  async updateRecipe(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) recipeId: string,
    @Body() body: UpdateRecipeDto,
  ): Promise<RecipeDetailDto> {
    const recipe = await this.recipesService.updateRecipe(recipeId, profileId, body);

    return RecipeMapper.toDetailDto(recipe);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar receta' })
  @ApiUuidParam('id', 'ID de la receta', SwaggerExamples.uuid.recipe)
  @ApiNoContentResponse({ description: 'Receta eliminada' })
  @ApiStandardMutationResponses()
  async deleteRecipe(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) recipeId: string,
  ): Promise<void> {
    await this.recipesService.deleteRecipe(recipeId, profileId);
  }
}
