import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class OnboardingResponseDto {
  @IsUUID()
  questionId!: string;

  @IsArray()
  @IsUUID('4', { each: true })
  optionIds!: string[];

  @IsOptional()
  @IsString()
  customValue!: string | null;
}
