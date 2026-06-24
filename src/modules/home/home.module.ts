import { Module } from '@nestjs/common';
import { PlannerModule } from '@modules/planner/planner.module';
import { StreaksModule } from '@modules/streaks/streaks.module';
import { HomeService } from './application/home.service';
import { HomeReadRepository } from './infrastructure/repositories/home-read.repository';
import { HomeController } from './presentation/controllers/home.controller';

@Module({
  imports: [PlannerModule, StreaksModule],
  controllers: [HomeController],
  providers: [HomeService, HomeReadRepository],
})
export class HomeModule {}
