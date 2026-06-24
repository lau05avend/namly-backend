import { Trim } from '@common/decorators/trim.decorator';
import { IsOptional, Matches } from 'class-validator';

export class GetAnalyticsRhythmQueryDto {
  @IsOptional()
  @Trim()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  weekStart?: string;
}
