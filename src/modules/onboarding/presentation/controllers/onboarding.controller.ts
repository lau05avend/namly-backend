import { Controller, Get } from '@nestjs/common';
import { Public } from '@common/decorators/public.decorator';
import { OnboardingService } from '../../application/onboarding.service';
import type { OnboardingQuestionDto } from '../dto/onboarding-question.dto';
import { OnboardingQuestionsMapper } from '../mappers/onboarding-questions.mapper';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Public()
  @Get('questions')
  async getQuestions(): Promise<OnboardingQuestionDto[]> {
    const questions = await this.onboardingService.getQuestions();

    return OnboardingQuestionsMapper.toDtoList(questions);
  }
}
