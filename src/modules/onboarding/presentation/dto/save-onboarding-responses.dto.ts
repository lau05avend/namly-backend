import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { OnboardingResponseItemDto } from './onboarding-response-item.dto';

export class SaveOnboardingResponsesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OnboardingResponseItemDto)
  responses!: OnboardingResponseItemDto[];
}
