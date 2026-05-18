import { Trim } from '@common/decorators/trim.decorator';
import {
  Allow,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import type { UpdateProfileParams } from '../../domain/interfaces/update-profile-params.interface';

@ValidatorConstraint({ name: 'atLeastOneProfileField', async: false })
class AtLeastOneProfileFieldConstraint implements ValidatorConstraintInterface {
  validate(_value: unknown, args: ValidationArguments): boolean {
    const dto = args.object as UpdateProfileDto;

    return dto.displayName !== undefined || dto.avatarUrl !== undefined;
  }

  defaultMessage(): string {
    return 'At least one field must be provided';
  }
}

export class UpdateProfileDto implements UpdateProfileParams {
  @Allow()
  @Validate(AtLeastOneProfileFieldConstraint)
  _atLeastOneField?: unknown;

  @Trim()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  displayName?: string;

  @Trim()
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
