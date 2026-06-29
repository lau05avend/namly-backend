import type { RecipeOriginEntity } from '../entities/recipe-origin.entity';

export type ResolveRecipeOriginParams = {
  readonly profileId: string | null;
  readonly isSuggested: boolean;
  readonly profileDisplayName: string | null;
};

export function resolveRecipeOrigin(params: ResolveRecipeOriginParams): RecipeOriginEntity {
  if (params.isSuggested) {
    return {
      profileId: null,
      profileDisplayName: null,
      isSuggested: true,
    };
  }

  return {
    profileId: params.profileId,
    profileDisplayName: params.profileDisplayName,
    isSuggested: false,
  };
}
