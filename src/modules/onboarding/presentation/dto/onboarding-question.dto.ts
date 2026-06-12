import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  ONBOARDING_OPTIONS_LAYOUT,
  type OnboardingOptionsLayout,
} from '../../domain/constants/onboarding-options-layout.constants';
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

  @IsString()
  questionIconName!: string;

  @IsEnum(ONBOARDING_OPTIONS_LAYOUT)
  optionsLayout!: OnboardingOptionsLayout;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OnboardingOptionDto)
  options!: OnboardingOptionDto[];
}
