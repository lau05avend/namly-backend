import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
import { Trim } from '@common/decorators/trim.decorator';
import { SwaggerExamples } from '@/docs/swagger/swagger.examples';

export class OnboardingResponseItemDto {
  @ApiProperty({
    description: 'ID de la pregunta de onboarding',
    example: SwaggerExamples.uuid.onboardingQuestionAlergias,
  })
  @IsUUID()
  questionId!: string;

  @ApiProperty({
    description: 'IDs de opciones seleccionadas',
    example: [SwaggerExamples.uuid.onboardingOptionAlergia],
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  optionIds!: string[];

  @ApiPropertyOptional({
    description: 'Texto libre cuando la pregunta lo permite',
    example: SwaggerExamples.text.customOnboardingValue,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @Trim()
  customValue?: string;
}
