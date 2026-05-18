import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { OnboardingOptionDto } from './onboarding-option.dto';

export class OnboardingQuestionDto {
  @IsUUID()
  id!: string;

  @IsString()
  questionText!: string;

  @IsString()
  inputType!: string;

  @IsBoolean()
  allowCustomInput!: boolean;

  @IsBoolean()
  allowMultiple!: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxSelections!: number | null;

  @IsInt()
  @Min(0)
  sortOrder!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OnboardingOptionDto)
  options!: OnboardingOptionDto[];
}
