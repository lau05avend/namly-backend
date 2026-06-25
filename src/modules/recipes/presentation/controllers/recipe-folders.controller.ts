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
import { RecipeFoldersService } from '../../application/recipe-folders.service';
import { FolderRecipesDto } from '../dto/folder-recipes.dto';
import { CreateRecipeFolderDto } from '../dto/create-recipe-folder.dto';
import { RecipeFolderDto } from '../dto/recipe-folder.dto';
import { UpdateRecipeFolderDto } from '../dto/update-recipe-folder.dto';
import { RecipeFolderMapper } from '../mappers/recipe-folder.mapper';

@ApiProtectedTag('Recipe Folders')
@Controller('recipe-folders')
export class RecipeFoldersController {
  constructor(private readonly recipeFoldersService: RecipeFoldersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar carpetas de recetas' })
  @ApiOkResponse({ type: RecipeFolderDto, isArray: true })
  @ApiStandardMutationResponses()
  async listFolders(@CurrentProfileId() profileId: string): Promise<RecipeFolderDto[]> {
    const folders = await this.recipeFoldersService.listFolders(profileId);

    return RecipeFolderMapper.toDtoList(folders);
  }

  @Post()
  @ApiBodyExample(CreateRecipeFolderDto, SwaggerRequestExamples.createRecipeFolder)
  @ApiOperation({ summary: 'Crear carpeta de recetas' })
  @ApiCreatedResponse({ type: RecipeFolderDto })
  @ApiStandardMutationResponses()
  async createFolder(
    @CurrentProfileId() profileId: string,
    @Body() body: CreateRecipeFolderDto,
  ): Promise<RecipeFolderDto> {
    const folder = await this.recipeFoldersService.createFolder(profileId, body);

    return RecipeFolderMapper.toDto(folder);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener carpeta por ID' })
  @ApiUuidParam('id', 'ID de la carpeta', SwaggerExamples.uuid.recipeFolder)
  @ApiOkResponse({ type: RecipeFolderDto })
  @ApiStandardMutationResponses()
  async getFolder(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) folderId: string,
  ): Promise<RecipeFolderDto> {
    const folder = await this.recipeFoldersService.getFolderById(folderId, profileId);

    return RecipeFolderMapper.toDto(folder);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar carpeta' })
  @ApiUuidParam('id', 'ID de la carpeta', SwaggerExamples.uuid.recipeFolder)
  @ApiOkResponse({ type: RecipeFolderDto })
  @ApiStandardMutationResponses()
  async updateFolder(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) folderId: string,
    @Body() body: UpdateRecipeFolderDto,
  ): Promise<RecipeFolderDto> {
    const folder = await this.recipeFoldersService.updateFolder(folderId, profileId, body);

    return RecipeFolderMapper.toDto(folder);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar carpeta' })
  @ApiUuidParam('id', 'ID de la carpeta', SwaggerExamples.uuid.recipeFolder)
  @ApiNoContentResponse({ description: 'Carpeta eliminada' })
  @ApiStandardMutationResponses()
  async deleteFolder(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) folderId: string,
  ): Promise<void> {
    await this.recipeFoldersService.deleteFolder(folderId, profileId);
  }

  @Post(':id/recipes')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBodyExample(FolderRecipesDto, SwaggerRequestExamples.folderRecipes)
  @ApiOperation({ summary: 'Agregar recetas a una carpeta' })
  @ApiUuidParam('id', 'ID de la carpeta', SwaggerExamples.uuid.recipeFolder)
  @ApiNoContentResponse({ description: 'Recetas agregadas' })
  @ApiStandardMutationResponses()
  async addRecipesToFolder(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) folderId: string,
    @Body() body: FolderRecipesDto,
  ): Promise<void> {
    await this.recipeFoldersService.addRecipesToFolder(folderId, profileId, body.recipeIds);
  }

  @Post(':id/recipes/remove')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBodyExample(FolderRecipesDto, SwaggerRequestExamples.folderRecipes)
  @ApiOperation({ summary: 'Quitar recetas de una carpeta' })
  @ApiUuidParam('id', 'ID de la carpeta', SwaggerExamples.uuid.recipeFolder)
  @ApiNoContentResponse({ description: 'Recetas removidas' })
  @ApiStandardMutationResponses()
  async removeRecipesFromFolder(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) folderId: string,
    @Body() body: FolderRecipesDto,
  ): Promise<void> {
    await this.recipeFoldersService.removeRecipesFromFolder(folderId, profileId, body.recipeIds);
  }
}
