import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { TagEntity } from '../domain/entities/tag.entity';
import type { CreateTagItemParams } from '../domain/interfaces/create-tag-item-params.interface';
import type { UpdateTagParams } from '../domain/interfaces/update-tag-params.interface';
import { TagRepository } from '../infrastructure/repositories/tag.repository';

@Injectable()
export class TagsService {
  constructor(private readonly tagRepository: TagRepository) {}

  getSystemTagsByCategory(category: string): Promise<TagEntity[]> {
    return this.tagRepository.findSystemTagsByCategory(category);
  }

  async getUserTagsByCategory(profileId: string, category: string): Promise<TagEntity[]> {
    await this.tagRepository.ensureUserTagsInitializedForCategory(profileId, category);

    return this.tagRepository.findUserTagsByCategory(profileId, category);
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

  async deleteUserTag(profileId: string, tagId: string): Promise<void> {
    const deleted = await this.tagRepository.softDeleteUserTag(profileId, tagId);

    if (!deleted) {
      throw new NotFoundException('Tag not found');
    }
  }
}
