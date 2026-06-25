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

@ApiProtectedTag('Scheduled Meals')
@Controller('scheduled-meals')
export class ScheduledMealsController {
  constructor(private readonly scheduledMealsService: ScheduledMealsService) {}

  @Get('suggestions')
  @ApiOperation({
    summary: 'Sugerencias de comida planificada para un registro',
    description: 'Devuelve comidas planificadas cercanas al momento del registro.',
  })
  @ApiOkResponse({ type: ScheduledMealSuggestionDto, isArray: true })
  @ApiStandardMutationResponses()
  async getSuggestions(
    @CurrentProfileId() profileId: string,
    @Query() query: ScheduledMealSuggestionsQueryDto,
  ): Promise<ScheduledMealSuggestionDto[]> {
    const suggestions = await this.scheduledMealsService.getSuggestionsForMealLog(
      profileId,
      query.loggedAt,
      query.scheduledMealId,
    );

    return ScheduledMealSuggestionMapper.toDtoList(suggestions);
  }

  @Get('calendar')
  @ApiOperation({ summary: 'Días con comidas planificadas en un mes' })
  @ApiOkResponse({ type: ScheduledMealsCalendarDto })
  @ApiStandardMutationResponses()
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
  @ApiOperation({
    summary: 'Listar comidas planificadas por fecha',
    description: 'Incluye el estado de cada comida: completed, next, upcoming o missed.',
  })
  @ApiOkResponse({ type: ScheduledMealDto, isArray: true })
  @ApiStandardMutationResponses()
  async listByDate(
    @CurrentProfileId() profileId: string,
    @Query() query: ListScheduledMealsQueryDto,
  ): Promise<ScheduledMealDto[]> {
    const meals = await this.scheduledMealsService.listByDate(profileId, query.date);

    return ScheduledMealMapper.toDtoList(meals);
  }

  @Post()
  @ApiBodyExample(
    CreateScheduledMealDto,
    SwaggerRequestExamples.createScheduledMeal,
    'Comida planificada con recetas',
  )
  @ApiOperation({ summary: 'Crear comida planificada' })
  @ApiCreatedResponse({ type: ScheduledMealDto })
  @ApiStandardMutationResponses()
  async create(
    @CurrentProfileId() profileId: string,
    @Body() body: CreateScheduledMealDto,
  ): Promise<ScheduledMealDto> {
    const meal = await this.scheduledMealsService.create(profileId, body);

    return ScheduledMealMapper.toDto(meal);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener comida planificada por ID',
    description:
      'Si la comida está completada, incluye completionMealLog con foto, fecha de registro, contenido y etiquetas.',
  })
  @ApiUuidParam('id', 'ID de la comida planificada', SwaggerExamples.uuid.scheduledMeal)
  @ApiOkResponse({ type: ScheduledMealDto })
  @ApiStandardMutationResponses()
  async getById(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) scheduledMealId: string,
  ): Promise<ScheduledMealDto> {
    const meal = await this.scheduledMealsService.getById(scheduledMealId, profileId);

    return ScheduledMealMapper.toDto(meal);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar comida planificada' })
  @ApiUuidParam('id', 'ID de la comida planificada', SwaggerExamples.uuid.scheduledMeal)
  @ApiOkResponse({ type: ScheduledMealDto })
  @ApiStandardMutationResponses()
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
  @ApiOperation({ summary: 'Eliminar comida planificada' })
  @ApiUuidParam('id', 'ID de la comida planificada', SwaggerExamples.uuid.scheduledMeal)
  @ApiNoContentResponse({ description: 'Comida planificada eliminada' })
  @ApiStandardMutationResponses()
  async delete(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) scheduledMealId: string,
  ): Promise<void> {
    await this.scheduledMealsService.delete(scheduledMealId, profileId);
  }
}
