import { ApiPropertyOptional } from '@nestjs/swagger';
import { Trim } from '@common/decorators/trim.decorator';
import {
  Allow,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { SwaggerExamples } from '@/docs/swagger/swagger.examples';
import type { UpdatePlatformSettingsParams } from '../../domain/interfaces/update-platform-settings-params.interface';

@ValidatorConstraint({ name: 'atLeastOnePlatformSetting', async: false })
class AtLeastOnePlatformSettingConstraint implements ValidatorConstraintInterface {
  validate(_value: unknown, args: ValidationArguments): boolean {
    const dto = args.object as UpdatePlatformSettingsDto;

    return !!dto.weightUnitId || !!dto.volumeUnitId || !!dto.language || !!dto.theme;
  }

  defaultMessage(): string {
    return 'At least one field must be provided';
  }
}

export class UpdatePlatformSettingsDto implements UpdatePlatformSettingsParams {
  @Allow()
  @Validate(AtLeastOnePlatformSettingConstraint)
  _atLeastOneField?: unknown;

  @ApiPropertyOptional({
    description: 'Unidad de peso preferida',
    example: SwaggerExamples.uuid.unitGramo,
  })
  @IsOptional()
  @IsUUID()
  weightUnitId?: string | null;

  @ApiPropertyOptional({
    description: 'Unidad de volumen preferida',
    example: SwaggerExamples.uuid.unitLitro,
  })
  @IsOptional()
  @IsUUID()
  volumeUnitId?: string | null;

  @ApiPropertyOptional({
    description: 'Código de idioma',
    example: SwaggerExamples.text.language,
  })
  @Trim()
  @IsOptional()
  @IsString()
  @MaxLength(32)
  language?: string | null;

  @ApiPropertyOptional({
    description: 'Tema de la aplicación',
    example: SwaggerExamples.text.theme,
  })
  @Trim()
  @IsOptional()
  @IsString()
  @MaxLength(32)
  theme?: string | null;
}
