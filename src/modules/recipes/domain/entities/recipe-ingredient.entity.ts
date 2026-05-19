import type { MeasurementUnitEntity } from '@modules/measurement-units/domain/entities/measurement-unit.entity';

export interface RecipeIngredientEntity {
  readonly id: string;
  readonly name: string;
  readonly quantity: number | null;
  readonly unitId: string | null;
  readonly unit: MeasurementUnitEntity | null;
}
