import { Trim } from '@common/decorators/trim.decorator';
import { Type } from 'class-transformer';
import {
  Allow,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Validate,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreateTagItemDto } from './create-tag-item.dto';

@ValidatorConstraint({ name: 'createTagsShape', async: false })
class CreateTagsShapeConstraint implements ValidatorConstraintInterface {
  validate(_value: unknown, args: ValidationArguments): boolean {
    const dto = args.object as CreateTagsDto;
    const hasSingleName = dto.name !== undefined && dto.name.length > 0;
    const hasBulkTags = Array.isArray(dto.tags) && dto.tags.length > 0;

    return (hasSingleName && !hasBulkTags) || (!hasSingleName && hasBulkTags);
  }

  defaultMessage(): string {
    return 'Provide either "name" for a single tag or a non-empty "tags" array for bulk creation';
  }
}

export class CreateTagsDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  category!: string; // TODO: revisar migracion de category a enum

  @Allow()
  @Validate(CreateTagsShapeConstraint)
  _createTagsShape?: unknown;

  @Trim()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name?: string;

  @Trim()
  @IsOptional()
  @IsString()
  @MaxLength(64)
  iconName?: string | null;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateTagItemDto)
  tags?: CreateTagItemDto[];
}
