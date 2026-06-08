import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  MEAL_LOG_CREATED_EVENT,
  MealLogCreatedEvent,
} from '@modules/meal-logs/domain/events/meal-log-created.event';
import {
  MEAL_LOG_DELETED_EVENT,
  MealLogDeletedEvent,
} from '@modules/meal-logs/domain/events/meal-log-deleted.event';
import {
  MEAL_LOG_UPDATED_EVENT,
  MealLogUpdatedEvent,
} from '@modules/meal-logs/domain/events/meal-log-updated.event';
import {
  SCHEDULED_MEAL_CREATED_EVENT,
  ScheduledMealCreatedEvent,
} from '@modules/planner/scheduled-meals/domain/events/scheduled-meal-created.event';
import {
  SCHEDULED_MEAL_DELETED_EVENT,
  ScheduledMealDeletedEvent,
} from '@modules/planner/scheduled-meals/domain/events/scheduled-meal-deleted.event';
import {
  SCHEDULED_MEAL_UPDATED_EVENT,
  ScheduledMealUpdatedEvent,
} from '@modules/planner/scheduled-meals/domain/events/scheduled-meal-updated.event';
import { HandleMealLogCreatedUseCase } from '../use-cases/handlers/handle-meal-log-created.use-case';
import { HandleMealLogDeletedUseCase } from '../use-cases/handlers/handle-meal-log-deleted.use-case';
import { HandleMealLogUpdatedUseCase } from '../use-cases/handlers/handle-meal-log-updated.use-case';
import { HandleScheduledMealCreatedUseCase } from '../use-cases/handlers/handle-scheduled-meal-created.use-case';
import { HandleScheduledMealDeletedUseCase } from '../use-cases/handlers/handle-scheduled-meal-deleted.use-case';
import { HandleScheduledMealUpdatedUseCase } from '../use-cases/handlers/handle-scheduled-meal-updated.use-case';

@Injectable()
export class DailyActivityListener {
  private readonly logger = new Logger(DailyActivityListener.name);

  constructor(
    private readonly handleMealLogCreatedUseCase: HandleMealLogCreatedUseCase,
    private readonly handleMealLogUpdatedUseCase: HandleMealLogUpdatedUseCase,
    private readonly handleMealLogDeletedUseCase: HandleMealLogDeletedUseCase,
    private readonly handleScheduledMealCreatedUseCase: HandleScheduledMealCreatedUseCase,
    private readonly handleScheduledMealUpdatedUseCase: HandleScheduledMealUpdatedUseCase,
    private readonly handleScheduledMealDeletedUseCase: HandleScheduledMealDeletedUseCase,
  ) {}

  @OnEvent(MEAL_LOG_CREATED_EVENT)
  async onMealLogCreated(event: MealLogCreatedEvent): Promise<void> {
    await this.run(() => this.handleMealLogCreatedUseCase.execute(event));
  }

  @OnEvent(MEAL_LOG_UPDATED_EVENT)
  async onMealLogUpdated(event: MealLogUpdatedEvent): Promise<void> {
    await this.run(() => this.handleMealLogUpdatedUseCase.execute(event));
  }

  @OnEvent(MEAL_LOG_DELETED_EVENT)
  async onMealLogDeleted(event: MealLogDeletedEvent): Promise<void> {
    await this.run(() => this.handleMealLogDeletedUseCase.execute(event));
  }

  @OnEvent(SCHEDULED_MEAL_CREATED_EVENT)
  async onScheduledMealCreated(event: ScheduledMealCreatedEvent): Promise<void> {
    await this.run(() => this.handleScheduledMealCreatedUseCase.execute(event));
  }

  @OnEvent(SCHEDULED_MEAL_UPDATED_EVENT)
  async onScheduledMealUpdated(event: ScheduledMealUpdatedEvent): Promise<void> {
    await this.run(() => this.handleScheduledMealUpdatedUseCase.execute(event));
  }

  @OnEvent(SCHEDULED_MEAL_DELETED_EVENT)
  async onScheduledMealDeleted(event: ScheduledMealDeletedEvent): Promise<void> {
    await this.run(() => this.handleScheduledMealDeletedUseCase.execute(event));
  }

  private async run(handler: () => Promise<void>): Promise<void> {
    try {
      await handler();
    } catch (error) {
      this.logger.error(
        'Daily activity listener handler failed',
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
