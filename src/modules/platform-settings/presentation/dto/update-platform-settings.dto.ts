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

  @IsOptional()
  @IsUUID()
  weightUnitId?: string | null;

  @IsOptional()
  @IsUUID()
  volumeUnitId?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  language?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  theme?: string | null;
}
