import { Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import type { OnboardingQuestionResponseInput } from '../../domain/interfaces/onboarding-question-response-input.interface';
import type { OnboardingResponseRow } from '../../domain/interfaces/onboarding-response-row.interface';
import {
  expandResponsesToRows,
  expandResponseToRows,
} from '../../domain/utils/expand-onboarding-response-rows.util';

const responseSelect = {
  questionId: true,
  optionId: true,
  customValue: true,
} as const;

@Injectable()
export class UserOnboardingResponseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllRowsByProfileId(profileId: string): Promise<OnboardingResponseRow[]> {
    const records = await this.prisma.userOnboardingResponse.findMany({
      where: { profileId },
      select: responseSelect,
      orderBy: { createdAt: 'asc' },
    });

    return records.map((record) => this.toRow(record));
  }

  async countDistinctAnsweredActiveQuestions(
    tx: Prisma.TransactionClient,
    profileId: string,
  ): Promise<number> {
    const groups = await tx.userOnboardingResponse.groupBy({
      by: ['questionId'],
      where: {
        profileId,
        question: { isActive: true },
      },
    });

    return groups.length;
  }

  async countQuestionsWithExistingResponses(
    profileId: string,
    questionIds: readonly string[],
  ): Promise<number> {
    if (questionIds.length === 0) {
      return 0;
    }

    const groups = await this.prisma.userOnboardingResponse.groupBy({
      by: ['questionId'],
      where: {
        profileId,
        questionId: { in: [...questionIds] },
      },
    });

    return groups.length;
  }

  async createManyRowsInTransaction(
    tx: Prisma.TransactionClient,
    profileId: string,
    rows: readonly OnboardingResponseRow[],
  ): Promise<void> {
    if (rows.length === 0) {
      return;
    }

    await tx.userOnboardingResponse.createMany({
      data: rows.map((row) => ({
        profileId,
        questionId: row.questionId,
        optionId: row.optionId,
        customValue: row.customValue,
      })),
    });
  }

  async replaceQuestionsInTransaction(
    tx: Prisma.TransactionClient,
    profileId: string,
    responses: readonly OnboardingQuestionResponseInput[],
  ): Promise<void> {
    if (responses.length === 0) {
      return;
    }

    const questionIds = responses.map((response) => response.questionId);

    await tx.userOnboardingResponse.deleteMany({
      where: {
        profileId,
        questionId: { in: questionIds },
      },
    });

    const rows = expandResponsesToRows(responses);
    await this.createManyRowsInTransaction(tx, profileId, rows);
  }

  async insertResponsesInTransaction(
    tx: Prisma.TransactionClient,
    profileId: string,
    responses: readonly OnboardingQuestionResponseInput[],
  ): Promise<void> {
    const rows = responses.flatMap((response) => expandResponseToRows(response));
    await this.createManyRowsInTransaction(tx, profileId, rows);
  }

  private toRow(record: {
    questionId: string;
    optionId: string | null;
    customValue: string | null;
  }): OnboardingResponseRow {
    return {
      questionId: record.questionId,
      optionId: record.optionId,
      customValue: record.customValue,
    };
  }
}
