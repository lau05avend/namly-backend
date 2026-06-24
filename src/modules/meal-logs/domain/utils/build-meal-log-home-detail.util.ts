type MealLogRegisteredForHomeRecord = {
  content: string | null;
  meal_log_recipes: Array<{
    recipes: { title: string };
  }>;
  scheduledMeal: {
    isExpress: boolean;
    expressNote: string | null;
  } | null;
};

export function buildMealLogHomeDetail(record: MealLogRegisteredForHomeRecord): string | null {
  const recipeNames = record.meal_log_recipes
    .map((link) => link.recipes.title.trim())
    .filter((title) => title.length > 0);

  if (recipeNames.length > 0) {
    return recipeNames.join(', ');
  }

  const content = record.content?.trim();

  if (content) {
    return content;
  }

  if (record.scheduledMeal?.isExpress === true) {
    const expressNote = record.scheduledMeal.expressNote?.trim();

    if (expressNote) {
      return expressNote;
    }
  }

  return null;
}
