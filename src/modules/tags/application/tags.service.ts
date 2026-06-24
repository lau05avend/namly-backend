import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type { TagEntity } from '../domain/entities/tag.entity';
import type { CreateTagItemParams } from '../domain/interfaces/create-tag-item-params.interface';
import type { UpdateTagParams } from '../domain/interfaces/update-tag-params.interface';
import { TagRepository } from '../infrastructure/repositories/tag.repository';

@Injectable()
export class TagsService {
  private readonly logger = new Logger(TagsService.name);
  private readonly userTagInitPromises = new Map<string, Promise<void>>();

  constructor(private readonly tagRepository: TagRepository) {}

  getSystemTagsByCategory(category: string): Promise<TagEntity[]> {
    return this.tagRepository.findSystemTagsByCategory(category);
  }

  async getUserTagsByCategory(profileId: string, category: string): Promise<TagEntity[]> {
    const tags = await this.tagRepository.findUserTagsByCategory(profileId, category);

    if (tags.length === 0) {
      this.scheduleUserTagsInitialization(profileId, category);
    }

    return tags;
  }

  private scheduleUserTagsInitialization(profileId: string, category: string): void {
    const key = `${profileId}:${category}`;
    const inFlight = this.userTagInitPromises.get(key);

    if (inFlight) {
      return;
    }

    const initPromise = this.tagRepository
      .ensureUserTagsInitializedForCategory(profileId, category)
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'unknown error';
        this.logger.warn(`User tag seed skipped for ${key}: ${message}`);
      })
      .finally(() => {
        this.userTagInitPromises.delete(key);
      });

    this.userTagInitPromises.set(key, initPromise);
  }

  async createUserTags(
    profileId: string,
    category: string,
    items: readonly CreateTagItemParams[],
  ): Promise<TagEntity[]> {
    if (items.length === 0) {
      throw new BadRequestException('At least one tag must be provided');
    }

    const namesInRequest = items.map((item) => item.name);
    const duplicateInRequest = namesInRequest.find(
      (name, index) => namesInRequest.indexOf(name) !== index,
    );

    if (duplicateInRequest) {
      throw new ConflictException(
        `Duplicate tag name "${duplicateInRequest}" in category "${category}"`,
      );
    }

    for (const item of items) {
      const nameExists = await this.tagRepository.existsUserTagWithNameInCategory(
        profileId,
        category,
        item.name,
      );

      if (nameExists) {
        throw new ConflictException(
          `A tag with name "${item.name}" already exists in category "${category}"`,
        );
      }
    }

    return this.tagRepository.createUserTags(profileId, category, items);
  }

  async updateUserTag(
    profileId: string,
    tagId: string,
    params: UpdateTagParams,
  ): Promise<TagEntity> {
    const nameExists = await this.tagRepository.existsUserTagWithNameInCategory(
      profileId,
      params.category,
      params.name,
      tagId,
    );

    if (nameExists) {
      throw new ConflictException(
        `A tag with name "${params.name}" already exists in category "${params.category}"`,
      );
    }

    const updated = await this.tagRepository.updateUserTag(profileId, tagId, params);

    if (!updated) {
      throw new NotFoundException('Tag not found');
    }

    return updated;
  }

  async assertTagsAccessible(profileId: string, tagIds: readonly string[]): Promise<void> {
    const uniqueTagIds = [...new Set(tagIds)];

    if (uniqueTagIds.length !== tagIds.length) {
      throw new BadRequestException('Duplicate tag IDs in request');
    }

    if (uniqueTagIds.length === 0) {
      return;
    }

    const accessibleCount = await this.tagRepository.countAccessibleForProfile(
      profileId,
      uniqueTagIds,
    );

    if (accessibleCount !== uniqueTagIds.length) {
      throw new NotFoundException('One or more tags were not found');
    }
  }

  async deleteUserTag(profileId: string, tagId: string): Promise<void> {
    const deleted = await this.tagRepository.softDeleteUserTag(profileId, tagId);

    if (!deleted) {
      throw new NotFoundException('Tag not found');
    }
  }
}
