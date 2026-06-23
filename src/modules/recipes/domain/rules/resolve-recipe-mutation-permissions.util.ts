export interface RecipeMutationSource {
  readonly profileId: string | null;
  readonly isSuggested: boolean;
}

export interface RecipeMutationPermissions {
  readonly canEdit: boolean;
  readonly canDelete: boolean;
}

export function resolveRecipeMutationPermissions(
  recipe: RecipeMutationSource,
  viewerProfileId: string,
): RecipeMutationPermissions {
  const isOwned = recipe.profileId === viewerProfileId;
  const canMutate = isOwned && !recipe.isSuggested;

  return {
    canEdit: canMutate,
    canDelete: canMutate,
  };
}
