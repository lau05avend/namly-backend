import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
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

  async findActiveQuestionsWithOptions(): Promise<OnboardingQuestionEntity[]> {
    const records = await this.prisma.onboardingQuestion.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: activeQuestionSelect,
    });

    return records.map((record) => this.toQuestionEntity(record));
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
