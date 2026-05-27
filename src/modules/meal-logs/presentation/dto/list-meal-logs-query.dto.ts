import { Matches } from 'class-validator';

export class ListMealLogsQueryDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  entryDate!: string;
}
