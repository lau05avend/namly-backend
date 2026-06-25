import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

async function main(): Promise<void> {
  const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL });
  const prisma = new PrismaClient({ adapter });

  const [
    profile,
    onboardingQuestions,
    onboardingOptions,
    mealType,
    userMealType,
    tag,
    recipeTags,
    measurementUnit,
    recipe,
    recipeSteps,
    recipeIngredients,
    scheduledMeal,
    mealLog,
    recipeFolder,
    platformSettings,
  ] = await Promise.all([
    prisma.profile.findFirst({ select: { id: true, displayName: true } }),
    prisma.onboardingQuestion.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      take: 3,
      select: { id: true, questionText: true },
    }),
    prisma.onboardingOption.findMany({
      take: 5,
      select: { id: true, label: true, questionId: true },
    }),
    prisma.mealType.findFirst({
      where: { isSystemDefined: true },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true },
    }),
    prisma.mealType.findFirst({
      where: { isSystemDefined: false, deletedAt: null },
      select: { id: true, name: true },
    }),
    prisma.tag.findFirst({
      where: { isSystemDefined: true, deletedAt: null, category: 'recipes' },
      select: { id: true, name: true, category: true },
    }),
    prisma.tag.findMany({
      where: { isSystemDefined: true, deletedAt: null, category: 'meal_logs' },
      take: 2,
      select: { id: true, name: true },
    }),
    prisma.measurementUnit.findFirst({
      where: { isActive: true },
      select: { id: true, name: true, abbreviation: true },
    }),
    prisma.recipe.findFirst({
      where: { deletedAt: null, isSuggested: false },
      select: { id: true, title: true, description: true, coverUrl: true },
    }),
    prisma.recipeStep.findMany({
      where: { recipe: { deletedAt: null } },
      take: 2,
      orderBy: { stepOrder: 'asc' },
      select: { id: true, description: true, stepOrder: true, durationMinutes: true },
    }),
    prisma.recipeIngredient.findMany({
      where: { recipe: { deletedAt: null } },
      take: 2,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        quantity: true,
        unitId: true,
      },
    }),
    prisma.scheduledMeal.findFirst({
      where: { deletedAt: null },
      select: { id: true, entryDate: true, plannedTime: true, mealTypeId: true },
    }),
    prisma.mealLog.findFirst({
      where: { deletedAt: null },
      select: {
        id: true,
        loggedAt: true,
        mealTypeId: true,
        mediaUrl: true,
        content: true,
        score: true,
      },
    }),
    prisma.recipeFolder.findFirst({
      where: { deletedAt: null },
      select: { id: true, name: true },
    }),
    prisma.userPlatformSetting.findFirst({
      select: { language: true, theme: true, weightUnitId: true, volumeUnitId: true },
    }),
  ]);

  console.log(
    JSON.stringify(
      {
        profileId: profile?.id,
        displayName: profile?.displayName,
        onboardingQuestions,
        onboardingOptions,
        mealType,
        userMealType,
        tag,
        recipeTags,
        measurementUnit,
        recipe,
        recipeSteps,
        recipeIngredients,
        scheduledMeal: scheduledMeal
          ? {
              id: scheduledMeal.id,
              mealTypeId: scheduledMeal.mealTypeId,
              entryDate: scheduledMeal.entryDate.toISOString().slice(0, 10),
              plannedTime: scheduledMeal.plannedTime.toISOString().slice(11, 16),
            }
          : null,
        mealLog: mealLog
          ? {
              id: mealLog.id,
              mealTypeId: mealLog.mealTypeId,
              loggedAt: mealLog.loggedAt.toISOString(),
            }
          : null,
        recipeFolder,
        platformSettings,
      },
      null,
      2,
    ),
  );

  await prisma.$disconnect();
}

void main();
