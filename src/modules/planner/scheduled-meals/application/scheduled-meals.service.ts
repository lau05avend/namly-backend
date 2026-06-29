import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { ScheduledMealEntity } from '../domain/entities/scheduled-meal.entity';
import type { CreateScheduledMealParams } from '../domain/interfaces/create-scheduled-meal-params.interface';
import type { UpdateScheduledMealParams } from '../domain/interfaces/update-scheduled-meal-params.interface';
import {
  SCHEDULED_MEAL_DELETED_EVENT,
  ScheduledMealDeletedEvent,
} from '../domain/events/scheduled-meal-deleted.event';
import {
  formatEntryDate,
  formatFloatingLocalEntryDate,
  formatPlannedTime,
  getMonthDateRange,
  parseMonthParam,
  toPlannedInstant,
} from '../domain/utils/scheduled-meal-datetime.util';
import { resolveRecipeLinksTotalDurationMinutes } from '@modules/recipes/domain/utils/resolve-recipe-links-total-duration-minutes.util';
import {
  ScheduledMealRepository,
  type ScheduledMealRecord,
} from '../infrastructure/repositories/scheduled-meal.repository';
import { CreateScheduledMealUseCase } from './use-cases/create-scheduled-meal.use-case';
import { UpdateScheduledMealUseCase } from './use-cases/update-scheduled-meal.use-case';
import { PlannerStatusService } from './planner-status.service';
import { toScheduledMealEntity, toScheduledMealStatusInput } from './scheduled-meal-entity.mapper';
import { ScheduledMealSuggestionEntity } from '../domain/entities/scheduled-meal-suggestion.entity';

@Injectable()
export class ScheduledMealsService {
  constructor(
    private readonly scheduledMealRepository: ScheduledMealRepository,
    private readonly plannerStatusService: PlannerStatusService,
    private readonly createScheduledMealUseCase: CreateScheduledMealUseCase,
    private readonly updateScheduledMealUseCase: UpdateScheduledMealUseCase,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async listByDate(profileId: string, entryDate: string): Promise<ScheduledMealEntity[]> {
    const records = await this.scheduledMealRepository.findByProfileAndDate(profileId, entryDate);
    const statuses = this.plannerStatusService.resolveStatuses(
      records.map((record) => toScheduledMealStatusInput(record, this.scheduledMealRepository)),
      entryDate,
    );

    return records.map((record) =>
      toScheduledMealEntity(
        record,
        statuses.get(record.id) ?? 'upcoming',
        this.scheduledMealRepository,
      ),
    );
  }

  async getById(scheduledMealId: string, profileId: string): Promise<ScheduledMealEntity> {
    const record = await this.scheduledMealRepository.findDetailByIdForProfile(
      scheduledMealId,
      profileId,
    );

    if (!record) {
      throw new NotFoundException('Scheduled meal not found');
    }

    const statuses = await this.plannerStatusService.resolveStatusesForMeal(profileId, record);
    const status = statuses.get(record.id) ?? 'upcoming';
    const completionMealLogRecord =
      status === 'completed' ? (record.mealLogs[0] ?? null) : null;

    return toScheduledMealEntity(
      record,
      status,
      this.scheduledMealRepository,
      completionMealLogRecord,
    );
  }

  async getCalendarDays(profileId: string, month: string): Promise<readonly string[]> {
    let year: number;
    let monthNumber: number;

    try {
      ({ year, month: monthNumber } = parseMonthParam(month));
      getMonthDateRange(year, monthNumber);
    } catch {
      throw new BadRequestException('month must be in YYYY-MM format');
    }

    return this.scheduledMealRepository.findDistinctEntryDatesForMonth(
      profileId,
      year,
      monthNumber,
    );
  }

  create(profileId: string, params: CreateScheduledMealParams): Promise<ScheduledMealEntity> {
    return this.createScheduledMealUseCase.execute(profileId, params);
  }

  async update(
    scheduledMealId: string,
    profileId: string,
    params: UpdateScheduledMealParams,
  ): Promise<ScheduledMealEntity> {
    const updated = await this.updateScheduledMealUseCase.execute(
      scheduledMealId,
      profileId,
      params,
    );

    if (!updated) {
      throw new NotFoundException('Scheduled meal not found');
    }

    return updated;
  }

  async assertLinkableForMealLog(
    profileId: string,
    scheduledMealId: string,
    excludeMealLogId?: string | null,
  ): Promise<void> {
    const record = await this.scheduledMealRepository.findByIdForProfile(
      scheduledMealId,
      profileId,
    );

    if (!record) {
      throw new NotFoundException('Scheduled meal not found');
    }

    if (this.scheduledMealRepository.hasMealLog(record, excludeMealLogId)) {
      throw new BadRequestException('Scheduled meal is already completed');
    }
  }

  async getSuggestionsForMealLog(
    profileId: string,
    loggedAt: Date,
    scheduledMealId?: string,
  ): Promise<ScheduledMealSuggestionEntity[]> {
    const entryDate = formatFloatingLocalEntryDate(loggedAt);
    let records = await this.scheduledMealRepository.findByProfileAndDate(profileId, entryDate);

    if (scheduledMealId) {
      const pinnedRecord = await this.scheduledMealRepository.findByIdForProfile(
        scheduledMealId,
        profileId,
      );

      if (!pinnedRecord) {
        throw new NotFoundException('Scheduled meal not found');
      }

      if (!records.some((record) => record.id === scheduledMealId)) {
        records = [...records, pinnedRecord];
      }
    }

    const windowStartMs = loggedAt.getTime() - 2 * 60 * 60 * 1000; // TODO: A futuro sacar la ventana de 2 hrs a una constante
    const windowEndMs = loggedAt.getTime() + 2 * 60 * 60 * 1000;
    const loggedAtMs = loggedAt.getTime();
    const isPinnedMeal = (recordId: string): boolean =>
      scheduledMealId !== undefined && recordId === scheduledMealId;

    const candidates = records
      .filter(
        (record) => !this.scheduledMealRepository.hasMealLog(record) || isPinnedMeal(record.id),
      )
      .map((record) => {
        const plannedInstant = toPlannedInstant(record.entryDate, record.plannedTime);
        const plannedMs = plannedInstant.getTime();

        return {
          record,
          plannedMs,
          distanceMs: Math.abs(plannedMs - loggedAtMs),
          plannedInstant,
        };
      })
      .filter(
        ({ record, plannedMs }) =>
          isPinnedMeal(record.id) || (plannedMs >= windowStartMs && plannedMs <= windowEndMs),
      )
      .sort((left, right) => left.distanceMs - right.distanceMs);

    return candidates.map(({ record }) => this.toSuggestionEntity(record));
  }

  private toSuggestionEntity(record: ScheduledMealRecord): ScheduledMealSuggestionEntity {
    const recipes =
      record.isExpress === true
        ? []
        : this.scheduledMealRepository.toRecipeEntities(record.scheduledMealRecipes);

    return {
      id: record.id,
      plannedTime: formatPlannedTime(record.plannedTime),
      mealType: record.mealType,
      recipes,
      totalDurationMinutes: resolveRecipeLinksTotalDurationMinutes(recipes),
      isExpress: record.isExpress,
      expressNote: record.isExpress ? record.expressNote : null,
    };
  }

  async delete(scheduledMealId: string, profileId: string): Promise<void> {
    const record = await this.scheduledMealRepository.findByIdForProfile(
      scheduledMealId,
      profileId,
    );

    if (!record) {
      throw new NotFoundException('Scheduled meal not found');
    }

    const deleted = await this.scheduledMealRepository.softDelete(scheduledMealId, profileId);

    if (!deleted) {
      throw new NotFoundException('Scheduled meal not found');
    }

    const entryDate = formatEntryDate(record.entryDate);
    this.eventEmitter.emit(
      SCHEDULED_MEAL_DELETED_EVENT,
      new ScheduledMealDeletedEvent(profileId, scheduledMealId, entryDate),
    );
  }

  async countByProfileAndDate(profileId: string, entryDate: string): Promise<number> {
    return this.scheduledMealRepository.countByProfileAndDate(profileId, entryDate);
  }
}
