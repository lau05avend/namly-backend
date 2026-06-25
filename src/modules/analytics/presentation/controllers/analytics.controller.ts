import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CurrentProfileId } from '@common/decorators/current-profile-id.decorator';
import { ApiProtectedTag } from '@/docs/swagger/decorators/api-protected.decorator';
import { ApiStandardErrorResponses } from '@/docs/swagger/decorators/api-standard-responses.decorator';
import { AnalyticsRhythmService } from '../../application/analytics-rhythm.service';
import { AnalyticsRhythmDto } from '../dto/analytics-rhythm.dto';
import { GetAnalyticsRhythmQueryDto } from '../dto/get-analytics-rhythm-query.dto';
import { AnalyticsRhythmMapper } from '../mappers/analytics-rhythm.mapper';

@ApiProtectedTag('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsRhythmService: AnalyticsRhythmService) {}

  @Get('rhythm')
  @ApiOperation({
    summary: 'Obtener analytics de ritmo semanal',
    description:
      'Devuelve resumen semanal, actividad diaria, insights de hábitos y estadísticas de lifetime. ' +
      'Si no se envía weekStart, usa la semana actual (lunes a domingo).',
  })
  @ApiOkResponse({ type: AnalyticsRhythmDto })
  @ApiStandardErrorResponses()
  async getRhythm(
    @CurrentProfileId() profileId: string,
    @Query() query: GetAnalyticsRhythmQueryDto,
  ): Promise<AnalyticsRhythmDto> {
    const rhythm = await this.analyticsRhythmService.getRhythm(profileId, query.weekStart);

    return AnalyticsRhythmMapper.toDto(rhythm);
  }
}
