import type { KeywordGroup } from '@shared/food-preferences/evaluate-recipe-compatibility.util';

export type UserFoodRestrictionsEntity = {
  avoidAllergenGroups: readonly KeywordGroup[];
  dietTagIds: readonly string[];
  dietTagNames: ReadonlyMap<string, string>;
  customAvoidTerms: readonly string[];
};
