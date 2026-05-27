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
  Query,
} from '@nestjs/common';
import { CurrentProfileId } from '@common/decorators/current-profile-id.decorator';
import { ScheduledMealsService } from '../../application/scheduled-meals.service';
import { CalendarScheduledMealsQueryDto } from '../dto/calendar-scheduled-meals-query.dto';
import { CreateScheduledMealDto } from '../dto/create-scheduled-meal.dto';
import { ListScheduledMealsQueryDto } from '../dto/list-scheduled-meals-query.dto';
import { ScheduledMealDto } from '../dto/scheduled-meal.dto';
import { ScheduledMealsCalendarDto } from '../dto/scheduled-meals-calendar.dto';
import { UpdateScheduledMealDto } from '../dto/update-scheduled-meal.dto';
import { ScheduledMealMapper } from '../mappers/scheduled-meal.mapper';
import { ScheduledMealSuggestionsQueryDto } from '../dto/scheduled-meal-suggestions-query.dto';
import { ScheduledMealSuggestionDto } from '../dto/scheduled-meal-suggestion.dto';
import { ScheduledMealSuggestionMapper } from '../mappers/scheduled-meal-suggestion.mapper';

@Controller('scheduled-meals')
export class ScheduledMealsController {
  constructor(private readonly scheduledMealsService: ScheduledMealsService) {}

  @Get('suggestions')
  async getSuggestions(
    @CurrentProfileId() profileId: string,
    @Query() query: ScheduledMealSuggestionsQueryDto,
  ): Promise<ScheduledMealSuggestionDto[]> {
    const suggestions = await this.scheduledMealsService.getSuggestionsForMealLog(
      profileId,
      query.loggedAt,
    );

    return ScheduledMealSuggestionMapper.toDtoList(suggestions);
  }

  @Get('calendar')
  async getCalendar(
    @CurrentProfileId() profileId: string,
    @Query() query: CalendarScheduledMealsQueryDto,
  ): Promise<ScheduledMealsCalendarDto> {
    const days = await this.scheduledMealsService.getCalendarDays(profileId, query.month);

    const dto = new ScheduledMealsCalendarDto();
    dto.days = [...days];

    return dto;
  }

  @Get()
  async listByDate(
    @CurrentProfileId() profileId: string,
    @Query() query: ListScheduledMealsQueryDto,
  ): Promise<ScheduledMealDto[]> {
    const meals = await this.scheduledMealsService.listByDate(profileId, query.date);

    return ScheduledMealMapper.toDtoList(meals);
  }

  @Post()
  async create(
    @CurrentProfileId() profileId: string,
    @Body() body: CreateScheduledMealDto,
  ): Promise<ScheduledMealDto> {
    const meal = await this.scheduledMealsService.create(profileId, body);

    return ScheduledMealMapper.toDto(meal);
  }

  @Get(':id')
  async getById(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) scheduledMealId: string,
  ): Promise<ScheduledMealDto> {
    const meal = await this.scheduledMealsService.getById(scheduledMealId, profileId);

    return ScheduledMealMapper.toDto(meal);
  }

  @Patch(':id')
  async update(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) scheduledMealId: string,
    @Body() body: UpdateScheduledMealDto,
  ): Promise<ScheduledMealDto> {
    const meal = await this.scheduledMealsService.update(scheduledMealId, profileId, body);

    return ScheduledMealMapper.toDto(meal);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) scheduledMealId: string,
  ): Promise<void> {
    await this.scheduledMealsService.delete(scheduledMealId, profileId);
  }
}
