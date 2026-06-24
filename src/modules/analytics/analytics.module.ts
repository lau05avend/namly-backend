import { Module } from '@nestjs/common';
import { AnalyticsRhythmService } from './application/analytics-rhythm.service';
import { AnalyticsRhythmReadRepository } from './infrastructure/repositories/analytics-rhythm-read.repository';
import { AnalyticsController } from './presentation/controllers/analytics.controller';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsRhythmService, AnalyticsRhythmReadRepository],
})
export class AnalyticsModule {}
