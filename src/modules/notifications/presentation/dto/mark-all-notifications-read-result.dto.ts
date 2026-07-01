import { IsInt, Min } from 'class-validator';

export class MarkAllNotificationsReadResultDto {
  @IsInt()
  @Min(0)
  updatedCount!: number;
}
