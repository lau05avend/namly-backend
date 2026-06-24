import { Controller, Get, Query } from '@nestjs/common';
import { CurrentProfileId } from '@common/decorators/current-profile-id.decorator';
import { AnalyticsRhythmService } from '../../application/analytics-rhythm.service';
import { AnalyticsRhythmDto } from '../dto/analytics-rhythm.dto';
import { GetAnalyticsRhythmQueryDto } from '../dto/get-analytics-rhythm-query.dto';
import { AnalyticsRhythmMapper } from '../mappers/analytics-rhythm.mapper';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsRhythmService: AnalyticsRhythmService) {}

  @Get('rhythm')
  async getRhythm(
    @CurrentProfileId() profileId: string,
    @Query() query: GetAnalyticsRhythmQueryDto,
  ): Promise<AnalyticsRhythmDto> {
    const rhythm = await this.analyticsRhythmService.getRhythm(profileId, query.weekStart);

    return AnalyticsRhythmMapper.toDto(rhythm);
  }
}
