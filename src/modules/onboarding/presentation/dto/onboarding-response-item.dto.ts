import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
import { Trim } from '@common/decorators/trim.decorator';

export class OnboardingResponseItemDto {
  @IsUUID()
  questionId!: string;

  @IsArray()
  @IsUUID('4', { each: true })
  optionIds!: string[];

  @IsOptional()
  @IsString()
  @Trim()
  customValue?: string;
}
