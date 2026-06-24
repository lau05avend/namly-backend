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
import { CurrentProfileId } from '@common/decorators/current-profile-id.decorator';
import { RecipesService } from '../../application/recipes.service';
import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { ListRecipesQueryDto } from '../dto/list-recipes-query.dto';
import { RecipeDetailDto } from '../dto/recipe-detail.dto';
import { RecipeListItemDto } from '../dto/recipe-list-item.dto';
import { UpdateRecipeDto } from '../dto/update-recipe.dto';
import { RecipeMapper } from '../mappers/recipe.mapper';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
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
  async createRecipe(
    @CurrentProfileId() profileId: string,
    @Body() body: CreateRecipeDto,
  ): Promise<RecipeDetailDto> {
    const recipe = await this.recipesService.createRecipe(profileId, body);

    return RecipeMapper.toDetailDto(recipe);
  }

  @Get(':id')
  async getRecipe(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) recipeId: string,
  ): Promise<RecipeDetailDto> {
    const recipe = await this.recipesService.getRecipeById(recipeId, profileId);

    return RecipeMapper.toDetailDto(recipe);
  }

  @Patch(':id')
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
  async deleteRecipe(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) recipeId: string,
  ): Promise<void> {
    await this.recipesService.deleteRecipe(recipeId, profileId);
  }
}
