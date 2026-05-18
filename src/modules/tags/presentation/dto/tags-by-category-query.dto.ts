import { Trim } from '@common/decorators/trim.decorator';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class TagsByCategoryQueryDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(64)
  category!: string;
}
