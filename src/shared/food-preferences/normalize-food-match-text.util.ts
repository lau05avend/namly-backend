export function normalizeFoodMatchText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .trim();
}

export function ingredientMatchesKeyword(ingredientName: string, keyword: string): boolean {
  const normalizedIngredient = normalizeFoodMatchText(ingredientName);
  const normalizedKeyword = normalizeFoodMatchText(keyword);

  if (!normalizedIngredient || !normalizedKeyword) {
    return false;
  }

  return normalizedIngredient.includes(normalizedKeyword);
}

export function parseCustomAvoidTerms(customValue: string | null | undefined): string[] {
  if (!customValue?.trim()) {
    return [];
  }

  return customValue
    .split(/[,;\n]+/)
    .map((term) => term.trim())
    .filter((term) => term.length >= 2);
}
