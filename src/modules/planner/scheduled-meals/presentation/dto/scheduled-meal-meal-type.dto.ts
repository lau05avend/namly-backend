import { IsInt, IsString, IsUUID, Min } from 'class-validator';

export class ScheduledMealMealTypeDto {
  @IsUUID()
  id!: string;

  @IsString()
  name!: string;

  @IsInt()
  @Min(0)
  sortOrder!: number;
}
