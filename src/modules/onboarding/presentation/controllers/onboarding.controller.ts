import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentProfileId } from '@common/decorators/current-profile-id.decorator';
import { Public } from '@common/decorators/public.decorator';
import { ApiBodyExample } from '@/docs/swagger/decorators/api-body-example.decorator';
import { ApiPublicOperation } from '@/docs/swagger/decorators/api-public-operation.decorator';
import {
  ApiStandardErrorResponses,
  ApiStandardMutationResponses,
} from '@/docs/swagger/decorators/api-standard-responses.decorator';
import { SwaggerRequestExamples } from '@/docs/swagger/swagger.examples';
import { SWAGGER_BEARER_AUTH } from '@/docs/swagger/swagger.constants';
import { OnboardingResponsesService } from '../../application/onboarding-responses.service';
import { OnboardingService } from '../../application/onboarding.service';
import { CompleteOnboardingResponsesUseCase } from '../../application/use-cases/complete-onboarding-responses.use-case';
import { UpdateOnboardingResponsesUseCase } from '../../application/use-cases/update-onboarding-responses.use-case';
import { OnboardingQuestionDto } from '../dto/onboarding-question.dto';
import { OnboardingResponseDto } from '../dto/onboarding-response.dto';
import { SaveOnboardingResponsesDto } from '../dto/save-onboarding-responses.dto';
import { OnboardingQuestionsMapper } from '../mappers/onboarding-questions.mapper';
import { OnboardingResponsesMapper } from '../mappers/onboarding-responses.mapper';

@ApiTags('Onboarding')
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
  @ApiPublicOperation({ summary: 'Listar preguntas activas de onboarding' })
  @ApiOkResponse({ type: OnboardingQuestionDto, isArray: true })
  async getQuestions(): Promise<OnboardingQuestionDto[]> {
    const questions = await this.onboardingService.getQuestions();

    return OnboardingQuestionsMapper.toDtoList(questions);
  }

  @Post('responses')
  @ApiBearerAuth(SWAGGER_BEARER_AUTH)
  @ApiBodyExample(
    SaveOnboardingResponsesDto,
    SwaggerRequestExamples.onboardingComplete,
    'Respuestas iniciales de onboarding',
  )
  @ApiOperation({
    summary: 'Completar onboarding',
    description: 'Registra respuestas iniciales. Falla si el onboarding ya fue completado.',
  })
  @ApiOkResponse({ type: OnboardingResponseDto, isArray: true })
  @ApiStandardMutationResponses()
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
  @ApiBearerAuth(SWAGGER_BEARER_AUTH)
  @ApiBodyExample(
    SaveOnboardingResponsesDto,
    SwaggerRequestExamples.onboardingPatch,
    'Actualización parcial de respuestas',
  )
  @ApiOperation({
    summary: 'Actualizar respuestas de onboarding',
    description: 'Reemplaza las respuestas de las preguntas enviadas en el body.',
  })
  @ApiOkResponse({ type: OnboardingResponseDto, isArray: true })
  @ApiStandardMutationResponses()
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
  @ApiBearerAuth(SWAGGER_BEARER_AUTH)
  @ApiOperation({ summary: 'Obtener respuestas de onboarding del usuario' })
  @ApiOkResponse({ type: OnboardingResponseDto, isArray: true })
  @ApiStandardErrorResponses()
  async getResponses(@CurrentProfileId() profileId: string): Promise<OnboardingResponseDto[]> {
    const responses = await this.onboardingResponsesService.getResponses(profileId);

    return OnboardingResponsesMapper.toDtoList(responses);
  }
}
