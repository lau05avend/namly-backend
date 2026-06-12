import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { CurrentProfileId } from '@common/decorators/current-profile-id.decorator';
import { Public } from '@common/decorators/public.decorator';
import { OnboardingResponsesService } from '../../application/onboarding-responses.service';
import { OnboardingService } from '../../application/onboarding.service';
import { CompleteOnboardingResponsesUseCase } from '../../application/use-cases/complete-onboarding-responses.use-case';
import { UpdateOnboardingResponsesUseCase } from '../../application/use-cases/update-onboarding-responses.use-case';
import type { OnboardingQuestionDto } from '../dto/onboarding-question.dto';
import type { OnboardingResponseDto } from '../dto/onboarding-response.dto';
import { SaveOnboardingResponsesDto } from '../dto/save-onboarding-responses.dto';
import { OnboardingQuestionsMapper } from '../mappers/onboarding-questions.mapper';
import { OnboardingResponsesMapper } from '../mappers/onboarding-responses.mapper';

@Controller('onboarding')
export class OnboardingController {
  constructor(
    private readonly onboardingService: OnboardingService,
    private readonly onboardingResponsesService: OnboardingResponsesService,
    private readonly completeOnboardingResponsesUseCase: CompleteOnboardingResponsesUseCase,
    private readonly updateOnboardingResponsesUseCase: UpdateOnboardingResponsesUseCase,
  ) {}

  @Public()
  @Get('questions')
  async getQuestions(): Promise<OnboardingQuestionDto[]> {
    const questions = await this.onboardingService.getQuestions();

    return OnboardingQuestionsMapper.toDtoList(questions);
  }

  @Post('responses')
  async completeOnboarding(
    @CurrentProfileId() profileId: string,
    @Body() dto: SaveOnboardingResponsesDto,
  ): Promise<OnboardingResponseDto[]> {
    const responses = await this.completeOnboardingResponsesUseCase.execute(
      profileId,
      OnboardingResponsesMapper.toInputList(dto.responses),
    );

    return OnboardingResponsesMapper.toDtoList(responses);
  }

  @Patch('responses')
  async updateResponses(
    @CurrentProfileId() profileId: string,
    @Body() dto: SaveOnboardingResponsesDto,
  ): Promise<OnboardingResponseDto[]> {
    const responses = await this.updateOnboardingResponsesUseCase.execute(
      profileId,
      OnboardingResponsesMapper.toInputList(dto.responses),
    );

    return OnboardingResponsesMapper.toDtoList(responses);
  }

  @Get('responses')
  async getResponses(@CurrentProfileId() profileId: string): Promise<OnboardingResponseDto[]> {
    const responses = await this.onboardingResponsesService.getResponses(profileId);

    return OnboardingResponsesMapper.toDtoList(responses);
  }
}
