export interface MeasurementUnitEntity {
  readonly id: string;
  readonly name: string;
  readonly abbreviation: string;
  readonly category: string;
  readonly isConvertible: boolean;
  readonly isDefault: boolean;
}
