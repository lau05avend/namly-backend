import { Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { ONBOARDING_OPTIONS_LAYOUT } from '../../domain/constants/onboarding-options-layout.constants';
import type { OnboardingOptionEntity } from '../../domain/entities/onboarding-option.entity';
import type { OnboardingQuestionEntity } from '../../domain/entities/onboarding-question.entity';

const activeQuestionSelect = {
  id: true,
  questionText: true,
  inputType: true,
  allowCustomInput: true,
  allowMultiple: true,
  maxSelections: true,
  sortOrder: true,
  questionIconName: true,
  optionsLayout: true,
  options: {
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' as const },
    select: {
      id: true,
      label: true,
      iconName: true,
      isDefault: true,
      sortOrder: true,
      linkedTagId: true,
    },
  },
} as const;

type ActiveQuestionRecord = {
  id: string;
  questionText: string;
  inputType: string;
  allowCustomInput: boolean;
  allowMultiple: boolean;
  maxSelections: number | null;
  sortOrder: number;
  questionIconName: string;
  optionsLayout: string;
  options: {
    id: string;
    label: string;
    iconName: string | null;
    isDefault: boolean;
    sortOrder: number;
    linkedTagId: string | null;
  }[];
};

@Injectable()
export class OnboardingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async countActiveQuestions(tx?: Prisma.TransactionClient): Promise<number> {
    const client = tx ?? this.prisma;

    return client.onboardingQuestion.count({
      where: { isActive: true },
    });
  }

  async countExistingQuestionsByIds(questionIds: readonly string[]): Promise<number> {
    if (questionIds.length === 0) {
      return 0;
    }

    return this.prisma.onboardingQuestion.count({
      where: {
        id: { in: [...questionIds] },
      },
    });
  }

  async countValidOptionQuestionPairs(
    pairs: readonly { questionId: string; optionId: string }[],
  ): Promise<number> {
    if (pairs.length === 0) {
      return 0;
    }

    return this.prisma.onboardingOption.count({
      where: {
        OR: pairs.map((pair) => ({
          id: pair.optionId,
          questionId: pair.questionId,
        })),
      },
    });
  }

  async findQuestionsCustomInputFlags(
    questionIds: readonly string[],
  ): Promise<Map<string, boolean>> {
    if (questionIds.length === 0) {
      return new Map();
    }

    const records = await this.prisma.onboardingQuestion.findMany({
      where: { id: { in: [...questionIds] } },
      select: { id: true, allowCustomInput: true },
    });

    return new Map(records.map((record) => [record.id, record.allowCustomInput]));
  }

  async findActiveQuestionsWithOptions(): Promise<OnboardingQuestionEntity[]> {
    const records = await this.prisma.onboardingQuestion.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: activeQuestionSelect,
    });

    return records.map((record) => this.toQuestionEntity(record as ActiveQuestionRecord));
  }

  private toQuestionEntity(record: ActiveQuestionRecord): OnboardingQuestionEntity {
    return {
      id: record.id,
      questionText: record.questionText,
      inputType: record.inputType,
      allowCustomInput: record.allowCustomInput,
      allowMultiple: record.allowMultiple,
      maxSelections: record.maxSelections,
      sortOrder: record.sortOrder,
      questionIconName: record.questionIconName,
      optionsLayout:
        record.optionsLayout === ONBOARDING_OPTIONS_LAYOUT.list
          ? ONBOARDING_OPTIONS_LAYOUT.list
          : ONBOARDING_OPTIONS_LAYOUT.chips,
      options: record.options.map((option) => this.toOptionEntity(option)),
    };
  }

  private toOptionEntity(option: ActiveQuestionRecord['options'][number]): OnboardingOptionEntity {
    return {
      id: option.id,
      label: option.label,
      iconName: option.iconName,
      isDefault: option.isDefault,
      sortOrder: option.sortOrder,
      linkedTagId: option.linkedTagId,
    };
  }
}
