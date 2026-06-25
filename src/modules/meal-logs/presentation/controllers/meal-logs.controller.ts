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
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CurrentProfileId } from '@common/decorators/current-profile-id.decorator';
import { ApiProtectedTag } from '@/docs/swagger/decorators/api-protected.decorator';
import { ApiBodyExample } from '@/docs/swagger/decorators/api-body-example.decorator';
import { ApiUuidParam } from '@/docs/swagger/decorators/api-uuid-param.decorator';
import { ApiStandardMutationResponses } from '@/docs/swagger/decorators/api-standard-responses.decorator';
import { SwaggerExamples, SwaggerRequestExamples } from '@/docs/swagger/swagger.examples';
import { MealLogsService } from '../../application/meal-logs.service';
import { CreateMealLogDto } from '../dto/create-meal-log.dto';
import { ListMealLogsQueryDto } from '../dto/list-meal-logs-query.dto';
import { MealLogDetailDto } from '../dto/meal-log-detail.dto';
import { MealLogHistoryItemDto } from '../dto/meal-log-history-item.dto';
import { MealLogsCalendarQueryDto } from '../dto/meal-logs-calendar-query.dto';
import { MealLogsCalendarDto } from '../dto/meal-logs-calendar.dto';
import { UpdateMealLogDto } from '../dto/update-meal-log.dto';
import { MealLogMapper } from '../mappers/meal-log.mapper';

@ApiProtectedTag('Meal Logs')
@Controller('meal-logs')
export class MealLogsController {
  constructor(private readonly mealLogsService: MealLogsService) {}

  @Get('calendar')
  @ApiOperation({ summary: 'Días con registros de comida en un mes' })
  @ApiOkResponse({ type: MealLogsCalendarDto })
  @ApiStandardMutationResponses()
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
  @ApiOperation({ summary: 'Listar registros de comida por fecha' })
  @ApiOkResponse({ type: MealLogHistoryItemDto, isArray: true })
  @ApiStandardMutationResponses()
  async listByDate(
    @CurrentProfileId() profileId: string,
    @Query() query: ListMealLogsQueryDto,
  ): Promise<MealLogHistoryItemDto[]> {
    const items = await this.mealLogsService.listHistoryByDate(profileId, query.entryDate);

    return MealLogMapper.toHistoryItemDtoList(items);
  }

  @Post()
  @ApiBodyExample(CreateMealLogDto, SwaggerRequestExamples.createMealLog)
  @ApiOperation({ summary: 'Registrar comida' })
  @ApiCreatedResponse({ type: MealLogDetailDto })
  @ApiStandardMutationResponses()
  async create(
    @CurrentProfileId() profileId: string,
    @Body() body: CreateMealLogDto,
  ): Promise<MealLogDetailDto> {
    const mealLog = await this.mealLogsService.create(profileId, body);

    return MealLogMapper.toDetailDto(mealLog);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener registro de comida por ID' })
  @ApiUuidParam('id', 'ID del registro de comida', SwaggerExamples.uuid.mealLog)
  @ApiOkResponse({ type: MealLogDetailDto })
  @ApiStandardMutationResponses()
  async getById(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) mealLogId: string,
  ): Promise<MealLogDetailDto> {
    const mealLog = await this.mealLogsService.getById(mealLogId, profileId);

    return MealLogMapper.toDetailDto(mealLog);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar registro de comida' })
  @ApiUuidParam('id', 'ID del registro de comida', SwaggerExamples.uuid.mealLog)
  @ApiOkResponse({ type: MealLogDetailDto })
  @ApiStandardMutationResponses()
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
  @ApiOperation({ summary: 'Eliminar registro de comida' })
  @ApiUuidParam('id', 'ID del registro de comida', SwaggerExamples.uuid.mealLog)
  @ApiNoContentResponse({ description: 'Registro eliminado' })
  @ApiStandardMutationResponses()
  async delete(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) mealLogId: string,
  ): Promise<void> {
    await this.mealLogsService.delete(mealLogId, profileId);
  }
}
