import { IsInt, Min } from 'class-validator';

export class NotificationUnreadCountDto {
  @IsInt()
  @Min(0)
  count!: number;
}
