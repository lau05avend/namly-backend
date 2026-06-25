/**
 * Ejemplos reales para Swagger. Datos obtenidos del entorno de desarrollo.
 * Regenerar con: pnpm exec ts-node -r tsconfig-paths/register scripts/fetch-swagger-samples.ts
 */
export const SwaggerExamples = {
  uuid: {
    profile: '6a938976-a95a-470d-b92d-8252ca58121a',
    mealTypeDesayuno: '1728aa8d-9322-4a1d-a5e3-1670f11464d2',
    mealTypeMediaManana: '2a353dc8-8faf-4daa-aab9-55fe262e1bfb',
    tagVegetariano: '1ed16115-9d16-4fb8-9732-b1d70407ec03',
    tagSaludable: '1597c2c1-87c9-48cb-b22c-6f991d53c7bd',
    unitGramo: 'e671fa4f-d894-439b-a79a-56df48a1dad0',
    unitLitro: '5752a146-7621-40b9-ac55-c9e4952aa2ae',
    recipe: 'ee668f8c-d0b4-4bab-b65d-7f901a58a52e',
    scheduledMeal: '6bce4671-f201-4edc-8560-dd2ee953b08a',
    mealLog: 'fd332d23-c193-497e-a065-10f5ac49ea91',
    recipeFolder: 'c3bd9acd-c271-4de5-b124-a87be88e91b6',
    onboardingQuestionRelacion: '602ea77f-4497-4f68-b8f8-15bfbf360011',
    onboardingQuestionAlergias: '2c3a7762-b4fe-4746-8e23-09ce643d95f8',
    onboardingOptionRelacion: '237e7d5d-7e40-4a28-a840-6720a76827ea',
    onboardingOptionAlergia: '28f6e0b7-5a90-4283-bb72-59bd106f159b',
  },
  date: {
    entry: '2026-05-26',
    weekStart: '2026-05-26',
    month: '2026-05',
  },
  time: {
    planned: '07:30',
  },
  text: {
    displayName: 'Laura',
    tagCategoryRecipes: 'recipes',
    tagCategoryMealLogs: 'meal_logs',
    recipeTitle: 'Quesadilla Express de Jamón y Queso',
    recipeDescription:
      'Una opción súper rápida para cuando hay poco tiempo. Crujiente por fuera y derretida por dentro.',
    folderName: 'Recetas de mi infancia',
    customOnboardingValue: 'no harinas',
    language: 'es',
    theme: 'light',
  },
  url: {
    mealLogMedia:
      'https://ngixldapgdqvhmznylpw.supabase.co/storage/v1/object/public/meal-logs/ejemplo.jpg',
    recipeCover:
      'https://ngixldapgdqvhmznylpw.supabase.co/storage/v1/object/public/recipes/ejemplo.jpg',
  },
  datetime: {
    mealLogLoggedAt: '2026-05-26T12:30:00.000Z',
    suggestionLoggedAt: '2026-05-26T12:25:00.000Z',
  },
} as const;

export const SwaggerRequestExamples = {
  syncAuthMe: {
    displayName: SwaggerExamples.text.displayName,
  },
  onboardingPatch: {
    responses: [
      {
        questionId: SwaggerExamples.uuid.onboardingQuestionAlergias,
        optionIds: [SwaggerExamples.uuid.onboardingOptionAlergia],
        customValue: SwaggerExamples.text.customOnboardingValue,
      },
    ],
  },
  onboardingComplete: {
    responses: [
      {
        questionId: SwaggerExamples.uuid.onboardingQuestionRelacion,
        optionIds: [SwaggerExamples.uuid.onboardingOptionRelacion],
        customValue: null,
      },
    ],
  },
  createScheduledMeal: {
    mealTypeId: SwaggerExamples.uuid.mealTypeDesayuno,
    entryDate: SwaggerExamples.date.entry,
    plannedTime: SwaggerExamples.time.planned,
    isExpress: false,
    recipeIds: [SwaggerExamples.uuid.recipe],
  },
  createScheduledMealExpress: {
    mealTypeId: SwaggerExamples.uuid.mealTypeMediaManana,
    entryDate: SwaggerExamples.date.entry,
    plannedTime: '10:00',
    isExpress: true,
    expressNote: 'Yogurt con granola',
  },
  createMealLog: {
    scheduledMealId: SwaggerExamples.uuid.scheduledMeal,
    mealTypeId: SwaggerExamples.uuid.mealTypeDesayuno,
    mediaUrl: SwaggerExamples.url.mealLogMedia,
    content: 'Desayuno completo',
    score: 4,
    loggedAt: SwaggerExamples.datetime.mealLogLoggedAt,
    tagIds: [SwaggerExamples.uuid.tagSaludable],
    recipeIds: [SwaggerExamples.uuid.recipe],
  },
  createRecipe: {
    title: SwaggerExamples.text.recipeTitle,
    description: SwaggerExamples.text.recipeDescription,
    coverUrl: SwaggerExamples.url.recipeCover,
    isPublic: false,
    ingredients: [
      {
        name: 'Tortilla de trigo',
        quantity: 2,
        unitId: SwaggerExamples.uuid.unitGramo,
      },
      {
        name: 'Queso mozzarella',
        quantity: 80,
        unitId: SwaggerExamples.uuid.unitGramo,
      },
    ],
    steps: [
      {
        stepOrder: 1,
        description: 'Calentar la sartén a fuego medio.',
        durationMinutes: 2,
      },
      {
        stepOrder: 2,
        description: 'Agregar el queso, doblar la tortilla y dorar por ambos lados.',
        durationMinutes: 5,
      },
    ],
    tagIds: [SwaggerExamples.uuid.tagVegetariano],
  },
  updatePlatformSettings: {
    language: SwaggerExamples.text.language,
    theme: SwaggerExamples.text.theme,
    weightUnitId: SwaggerExamples.uuid.unitGramo,
    volumeUnitId: SwaggerExamples.uuid.unitLitro,
  },
  createRecipeFolder: {
    name: SwaggerExamples.text.folderName,
  },
  folderRecipes: {
    recipeIds: [SwaggerExamples.uuid.recipe],
  },
} as const;
