import { Injectable } from '@nestjs/common';
import { TagKeywordRepository } from '@modules/tags/infrastructure/repositories/tag-keyword.repository';
import { TagReadRepository } from '@modules/tags/infrastructure/repositories/tag-read.repository';
import {
  ONBOARDING_ALLERGIES_QUESTION_SORT_ORDER,
  ONBOARDING_DIET_QUESTION_SORT_ORDER,
  ONBOARDING_SKIP_OPTION_LABELS,
} from '@shared/food-preferences/food-preferences.constants';
import type { KeywordGroup } from '@shared/food-preferences/evaluate-recipe-compatibility.util';
import { parseCustomAvoidTerms } from '@shared/food-preferences/normalize-food-match-text.util';
import type { UserFoodRestrictionsEntity } from '../domain/entities/user-food-restrictions.entity';
import { OnboardingRepository } from '../infrastructure/repositories/onboarding.repository';
import { UserOnboardingResponseRepository } from '../infrastructure/repositories/user-onboarding-response.repository';

@Injectable()
export class UserFoodPreferencesService {
  constructor(
    private readonly userOnboardingResponseRepository: UserOnboardingResponseRepository,
    private readonly onboardingRepository: OnboardingRepository,
    private readonly tagKeywordRepository: TagKeywordRepository,
    private readonly tagReadRepository: TagReadRepository,
  ) {}

  async resolveForProfile(profileId: string): Promise<UserFoodRestrictionsEntity> {
    const [responseRows, questions] = await Promise.all([
      this.userOnboardingResponseRepository.findAllRowsByProfileId(profileId),
      this.onboardingRepository.findActiveQuestionsWithOptions(),
    ]);

    if (responseRows.length === 0) {
      return this.emptyRestrictions();
    }

    const optionById = new Map(
      questions.flatMap((question) => question.options.map((option) => [option.id, option] as const)),
    );

    const responsesByQuestion = new Map<string, { optionIds: Set<string>; customValue: string | null }>();

    for (const row of responseRows) {
      const entry = responsesByQuestion.get(row.questionId) ?? {
        optionIds: new Set<string>(),
        customValue: null,
      };

      if (row.optionId) {
        entry.optionIds.add(row.optionId);
      }

      if (row.customValue) {
        entry.customValue = row.customValue;
      }

      responsesByQuestion.set(row.questionId, entry);
    }

    const avoidAllergenTagIds: string[] = [];
    const dietTagIds: string[] = [];
    const customAvoidTerms: string[] = [];

    for (const question of questions) {
      const response = responsesByQuestion.get(question.id);

      if (!response) {
        continue;
      }

      const selectedOptions = [...response.optionIds]
        .map((optionId) => optionById.get(optionId))
        .filter((option) => option !== undefined);

      const selectedLabels = selectedOptions.map((option) => option.label);
      const isSkipped =
        selectedLabels.length > 0 &&
        selectedLabels.every((label) => ONBOARDING_SKIP_OPTION_LABELS.has(label));

      if (question.sortOrder === ONBOARDING_ALLERGIES_QUESTION_SORT_ORDER) {
        if (response.customValue) {
          customAvoidTerms.push(...parseCustomAvoidTerms(response.customValue));
        }

        if (isSkipped) {
          continue;
        }

        for (const option of selectedOptions) {
          if (option.linkedTagId) {
            avoidAllergenTagIds.push(option.linkedTagId);
          }
        }

        continue;
      }

      if (question.sortOrder === ONBOARDING_DIET_QUESTION_SORT_ORDER) {
        if (isSkipped) {
          continue;
        }

        for (const option of selectedOptions) {
          if (option.linkedTagId) {
            dietTagIds.push(option.linkedTagId);
          }
        }
      }
    }

    const uniqueAvoidTagIds = [...new Set(avoidAllergenTagIds)];
    const uniqueDietTagIds = [...new Set(dietTagIds)];
    const uniqueCustomTerms = [...new Set(customAvoidTerms.map((term) => term.trim()).filter(Boolean))];

    const [keywordRecords, dietTagNames] = await Promise.all([
      this.tagKeywordRepository.findKeywordsByTagIds(uniqueAvoidTagIds),
      this.tagReadRepository.findNamesByIds(uniqueDietTagIds),
    ]);

    return {
      avoidAllergenGroups: this.groupKeywords(keywordRecords),
      dietTagIds: uniqueDietTagIds,
      dietTagNames,
      customAvoidTerms: uniqueCustomTerms,
    };
  }

  private groupKeywords(
    records: readonly { tagId: string; tagName: string; keyword: string }[],
  ): KeywordGroup[] {
    const grouped = new Map<string, KeywordGroup>();

    for (const record of records) {
      const existing = grouped.get(record.tagId);

      if (!existing) {
        grouped.set(record.tagId, {
          tagId: record.tagId,
          tagName: record.tagName,
          keywords: [record.keyword],
        });
        continue;
      }

      grouped.set(record.tagId, {
        ...existing,
        keywords: [...existing.keywords, record.keyword],
      });
    }

    return [...grouped.values()];
  }

  private emptyRestrictions(): UserFoodRestrictionsEntity {
    return {
      avoidAllergenGroups: [],
      dietTagIds: [],
      dietTagNames: new Map(),
      customAvoidTerms: [],
    };
  }
}
