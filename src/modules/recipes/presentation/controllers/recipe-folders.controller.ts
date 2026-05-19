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
import { CurrentProfileId } from '@common/decorators/current-profile-id.decorator';
import { RecipeFoldersService } from '../../application/recipe-folders.service';
import { FolderRecipesDto } from '../dto/folder-recipes.dto';
import { CreateRecipeFolderDto } from '../dto/create-recipe-folder.dto';
import { RecipeFolderDto } from '../dto/recipe-folder.dto';
import { UpdateRecipeFolderDto } from '../dto/update-recipe-folder.dto';
import { RecipeFolderMapper } from '../mappers/recipe-folder.mapper';

@Controller('recipe-folders')
export class RecipeFoldersController {
  constructor(private readonly recipeFoldersService: RecipeFoldersService) {}

  @Get()
  async listFolders(@CurrentProfileId() profileId: string): Promise<RecipeFolderDto[]> {
    const folders = await this.recipeFoldersService.listFolders(profileId);

    return RecipeFolderMapper.toDtoList(folders);
  }

  @Post()
  async createFolder(
    @CurrentProfileId() profileId: string,
    @Body() body: CreateRecipeFolderDto,
  ): Promise<RecipeFolderDto> {
    const folder = await this.recipeFoldersService.createFolder(profileId, body);

    return RecipeFolderMapper.toDto(folder);
  }

  @Get(':id')
  async getFolder(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) folderId: string,
  ): Promise<RecipeFolderDto> {
    const folder = await this.recipeFoldersService.getFolderById(folderId, profileId);

    return RecipeFolderMapper.toDto(folder);
  }

  @Patch(':id')
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
  async deleteFolder(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) folderId: string,
  ): Promise<void> {
    await this.recipeFoldersService.deleteFolder(folderId, profileId);
  }

  @Post(':id/recipes')
  @HttpCode(HttpStatus.NO_CONTENT)
  async addRecipesToFolder(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) folderId: string,
    @Body() body: FolderRecipesDto,
  ): Promise<void> {
    await this.recipeFoldersService.addRecipesToFolder(folderId, profileId, body.recipeIds);
  }

  @Post(':id/recipes/remove')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeRecipesFromFolder(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) folderId: string,
    @Body() body: FolderRecipesDto,
  ): Promise<void> {
    await this.recipeFoldersService.removeRecipesFromFolder(folderId, profileId, body.recipeIds);
  }
}
