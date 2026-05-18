import { Trim } from '@common/decorators/trim.decorator';
import {
  Allow,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import type { UpdateMealTypeParams } from '../../domain/interfaces/update-meal-type-params.interface';

@ValidatorConstraint({ name: 'atLeastOneMealTypeField', async: false })
class AtLeastOneMealTypeFieldConstraint implements ValidatorConstraintInterface {
  validate(_value: unknown, args: ValidationArguments): boolean {
    const dto = args.object as UpdateMealTypeDto;

    return !!dto.name || !!dto.sortOrder;
  }

  defaultMessage(): string {
    return 'At least one field must be provided';
  }
}

export class UpdateMealTypeDto implements UpdateMealTypeParams {
  @Allow()
  @Validate(AtLeastOneMealTypeFieldConstraint)
  _atLeastOneField?: unknown;

  @Trim()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
