import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { RecipeFolderEntity } from '../domain/entities/recipe-folder.entity';
import type { CreateRecipeFolderParams } from '../domain/interfaces/create-recipe-folder-params.interface';
import type { UpdateRecipeFolderParams } from '../domain/interfaces/update-recipe-folder-params.interface';
import { RecipeFolderItemRepository } from '../infrastructure/repositories/recipe-folder-item.repository';
import { RecipeFolderRepository } from '../infrastructure/repositories/recipe-folder.repository';
import { RecipeAccessService } from './recipe-access.service';

@Injectable()
export class RecipeFoldersService {
  constructor(
    private readonly recipeFolderRepository: RecipeFolderRepository,
    private readonly recipeFolderItemRepository: RecipeFolderItemRepository,
    private readonly recipeAccessService: RecipeAccessService,
  ) {}

  listFolders(profileId: string): Promise<RecipeFolderEntity[]> {
    return this.recipeFolderRepository.findAllByProfileId(profileId);
  }

  async getFolderById(folderId: string, profileId: string): Promise<RecipeFolderEntity> {
    const folder = await this.recipeFolderRepository.findByIdForProfile(folderId, profileId);

    if (!folder) {
      throw new NotFoundException('Recipe folder not found');
    }

    return folder;
  }

  async createFolder(
    profileId: string,
    params: CreateRecipeFolderParams,
  ): Promise<RecipeFolderEntity> {
    const nameExists = await this.recipeFolderRepository.existsWithNameForProfile(
      profileId,
      params.name,
    );

    if (nameExists) {
      throw new ConflictException(`A folder with name "${params.name}" already exists`);
    }

    return this.recipeFolderRepository.create(profileId, params);
  }

  async updateFolder(
    folderId: string,
    profileId: string,
    params: UpdateRecipeFolderParams,
  ): Promise<RecipeFolderEntity> {
    if (!params.name && !params.colorHex) {
      throw new BadRequestException('At least one field must be provided');
    }

    if (params.name) {
      const nameExists = await this.recipeFolderRepository.existsWithNameForProfile(
        profileId,
        params.name,
        folderId,
      );

      if (nameExists) {
        throw new ConflictException(`A folder with name "${params.name}" already exists`);
      }
    }

    const updated = await this.recipeFolderRepository.update(folderId, profileId, params);

    if (!updated) {
      throw new NotFoundException('Recipe folder not found');
    }

    return updated;
  }

  async deleteFolder(folderId: string, profileId: string): Promise<void> {
    const deleted = await this.recipeFolderRepository.softDelete(folderId, profileId);

    if (!deleted) {
      throw new NotFoundException('Recipe folder not found');
    }
  }

  async addRecipesToFolder(
    folderId: string,
    profileId: string,
    recipeIds: readonly string[],
  ): Promise<void> {
    await this.assertFolderOwned(folderId, profileId);
    this.assertNoDuplicateRecipeIds(recipeIds);

    const alreadyLinked = await this.recipeFolderItemRepository.findExistingRecipeIds(
      folderId,
      recipeIds,
    );
    const alreadyLinkedSet = new Set(alreadyLinked);
    const recipeIdsToAdd = recipeIds.filter((recipeId) => !alreadyLinkedSet.has(recipeId));

    if (recipeIdsToAdd.length === 0) {
      return;
    }

    await Promise.all(
      recipeIdsToAdd.map((recipeId) =>
        this.recipeAccessService.assertRecipeAccessible(recipeId, profileId),
      ),
    );

    await this.recipeFolderItemRepository.createMany(folderId, recipeIdsToAdd);
  }

  async removeRecipesFromFolder(
    folderId: string,
    profileId: string,
    recipeIds: readonly string[],
  ): Promise<void> {
    await this.assertFolderOwned(folderId, profileId);
    this.assertNoDuplicateRecipeIds(recipeIds);

    const removedCount = await this.recipeFolderItemRepository.deleteMany(folderId, recipeIds);

    if (removedCount !== recipeIds.length) {
      throw new NotFoundException('One or more recipes are not in this folder');
    }
  }

  private assertNoDuplicateRecipeIds(recipeIds: readonly string[]): void {
    const uniqueIds = new Set(recipeIds);

    if (uniqueIds.size !== recipeIds.length) {
      throw new ConflictException('Duplicate recipe IDs in request');
    }
  }

  async assertFolderOwned(folderId: string, profileId: string): Promise<void> {
    const folder = await this.recipeFolderRepository.findByIdForProfile(folderId, profileId);

    if (!folder) {
      throw new NotFoundException('Recipe folder not found');
    }
  }
}
