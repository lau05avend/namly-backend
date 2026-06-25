import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { OnboardingResponseItemDto } from './onboarding-response-item.dto';
import { SwaggerRequestExamples } from '@/docs/swagger/swagger.examples';

export class SaveOnboardingResponsesDto {
  @ApiProperty({
    description: 'Respuestas por pregunta',
    type: [OnboardingResponseItemDto],
    example: SwaggerRequestExamples.onboardingPatch.responses,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OnboardingResponseItemDto)
  responses!: OnboardingResponseItemDto[];
}
