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
import { MealLogsService } from '../../application/meal-logs.service';
import { CreateMealLogDto } from '../dto/create-meal-log.dto';
import { ListMealLogsQueryDto } from '../dto/list-meal-logs-query.dto';
import { MealLogDetailDto } from '../dto/meal-log-detail.dto';
import { MealLogHistoryItemDto } from '../dto/meal-log-history-item.dto';
import { MealLogsCalendarQueryDto } from '../dto/meal-logs-calendar-query.dto';
import { MealLogsCalendarDto } from '../dto/meal-logs-calendar.dto';
import { UpdateMealLogDto } from '../dto/update-meal-log.dto';
import { MealLogMapper } from '../mappers/meal-log.mapper';

@Controller('meal-logs')
export class MealLogsController {
  constructor(private readonly mealLogsService: MealLogsService) {}

  @Get('calendar')
  async getCalendar(
    @CurrentProfileId() profileId: string,
    @Query() query: MealLogsCalendarQueryDto,
  ): Promise<MealLogsCalendarDto> {
    const days = await this.mealLogsService.getCalendarDays(profileId, query.year, query.month);

    const dto = new MealLogsCalendarDto();
    dto.days = [...days];

    return dto;
  }

  @Get()
  async listByDate(
    @CurrentProfileId() profileId: string,
    @Query() query: ListMealLogsQueryDto,
  ): Promise<MealLogHistoryItemDto[]> {
    const items = await this.mealLogsService.listHistoryByDate(profileId, query.entryDate);

    return MealLogMapper.toHistoryItemDtoList(items);
  }

  @Post()
  async create(
    @CurrentProfileId() profileId: string,
    @Body() body: CreateMealLogDto,
  ): Promise<MealLogDetailDto> {
    const mealLog = await this.mealLogsService.create(profileId, body);

    return MealLogMapper.toDetailDto(mealLog);
  }

  @Get(':id')
  async getById(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) mealLogId: string,
  ): Promise<MealLogDetailDto> {
    const mealLog = await this.mealLogsService.getById(mealLogId, profileId);

    return MealLogMapper.toDetailDto(mealLog);
  }

  @Patch(':id')
  async update(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) mealLogId: string,
    @Body() body: UpdateMealLogDto,
  ): Promise<MealLogDetailDto> {
    const mealLog = await this.mealLogsService.update(mealLogId, profileId, body);

    return MealLogMapper.toDetailDto(mealLog);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) mealLogId: string,
  ): Promise<void> {
    await this.mealLogsService.delete(mealLogId, profileId);
  }
}
