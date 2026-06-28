import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import type { ProfileResetContext } from '../../domain/interfaces/profile-reset-context.interface';

@Injectable()
export class ProfileResetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findResetContext(profileId: string): Promise<ProfileResetContext> {
    const authIdentity = await this.prisma.authIdentity.findFirst({
      where: { profileId },
      select: { authUserId: true },
    });

    if (!authIdentity) {
      throw new NotFoundException('Profile not found');
    }

    const [profile, mealLogs, privateRecipeCovers] = await Promise.all([
      this.prisma.profile.findUnique({
        where: { id: profileId },
        select: { avatarUrl: true },
      }),
      this.prisma.mealLog.findMany({
        where: { profileId },
        select: { mediaUrl: true },
      }),
      this.prisma.recipe.findMany({
        where: {
          profileId,
          isPublic: false,
        },
        select: { coverUrl: true },
      }),
    ]);

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const mediaUrls = [
      profile.avatarUrl,
      ...mealLogs.map((mealLog) => mealLog.mediaUrl),
      ...privateRecipeCovers.map((recipe) => recipe.coverUrl),
    ].filter((url): url is string => typeof url === 'string' && url.trim().length > 0);

    return {
      authUserId: authIdentity.authUserId,
      mediaUrls,
    };
  }

  async deleteAccountData(profileId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await this.deleteAccountDataInTransaction(tx, profileId);
    });
  }

  private async deleteAccountDataInTransaction(
    tx: Prisma.TransactionClient,
    profileId: string,
  ): Promise<void> {
    await tx.mealLogTagLink.deleteMany({
      where: { mealLog: { profileId } },
    });

    await tx.meal_log_recipes.deleteMany({
      where: { meal_logs: { profileId } },
    });

    await tx.mealLog.deleteMany({
      where: { profileId },
    });

    await tx.scheduledMealReminder.deleteMany({
      where: { scheduledMeal: { profileId } },
    });

    await tx.scheduledMealRecipe.deleteMany({
      where: { scheduledMeal: { profileId } },
    });

    await tx.scheduledMeal.deleteMany({
      where: { profileId },
    });

    await tx.userRecipeInteraction.deleteMany({
      where: { profileId },
    });

    await tx.recipe.updateMany({
      where: {
        profileId,
        isPublic: true,
        isSuggested: false,
      },
      data: { profileId: null },
    });

    await tx.recipeFolderItem.deleteMany({
      where: {
        OR: [{ folder: { profileId } }, { recipe: { profileId } }],
      },
    });

    await tx.meal_log_recipes.deleteMany({
      where: { recipes: { profileId } },
    });

    await tx.scheduledMealRecipe.deleteMany({
      where: { recipe: { profileId } },
    });

    await tx.recipeTagLink.deleteMany({
      where: { recipe: { profileId } },
    });

    await tx.recipeIngredient.deleteMany({
      where: { recipe: { profileId } },
    });

    await tx.recipeStep.deleteMany({
      where: { recipe: { profileId } },
    });

    await tx.recipe.deleteMany({
      where: { profileId },
    });

    await tx.recipeFolder.deleteMany({
      where: { profileId },
    });

    await tx.tag.deleteMany({
      where: {
        profileId,
        isSystemDefined: false,
      },
    });

    await tx.mealType.deleteMany({
      where: {
        profileId,
        isSystemDefined: false,
      },
    });

    await tx.userOnboardingResponse.deleteMany({
      where: { profileId },
    });

    await tx.notification.deleteMany({
      where: { profileId },
    });

    await tx.userDailyActivity.deleteMany({
      where: { profileId },
    });

    await tx.userStreak.deleteMany({
      where: { profileId },
    });

    await tx.guestSession.deleteMany({
      where: { profileId },
    });

    await tx.userPlatformSetting.deleteMany({
      where: { profileId },
    });

    await tx.authIdentity.deleteMany({
      where: { profileId },
    });

    await tx.profile.delete({
      where: { id: profileId },
    });
  }
}
