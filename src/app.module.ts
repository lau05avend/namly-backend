import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import appConfig from '@config/app.config';
import supabaseConfig from '@config/supabase.config';
import { validateEnvironment } from '@config/env.validation';

// Infrastructure Modules
import { PrismaModule } from '@infrastructure/database/prisma/prisma.module';
import { SupabaseModule } from '@infrastructure/database/supabase/supabase.module';
import { AppEventsModule } from '@infrastructure/events/events.module';
import { StorageModule } from '@infrastructure/storage/storage.module';
import { CronModule } from '@infrastructure/cron/cron.module';

// Domain Modules (placeholders)
import { AuthModule } from '@modules/auth/auth.module';
import { ProfilesModule } from '@modules/profiles/profiles.module';
import { GuestsModule } from '@modules/guests/guests.module';
import { OnboardingModule } from '@modules/onboarding/onboarding.module';
import { TagsModule } from '@modules/tags/tags.module';
import { RecipesModule } from '@modules/recipes/recipes.module';
import { PlannerModule } from '@modules/planner/planner.module';
import { MealLogsModule } from '@modules/meal-logs/meal-logs.module';
import { StreaksModule } from '@modules/streaks/streaks.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { SettingsModule } from '@modules/settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, supabaseConfig],
      validate: validateEnvironment,
    }),
    EventEmitterModule.forRoot(),

    // Infrastructure Modules
    PrismaModule,
    SupabaseModule,
    AppEventsModule,
    StorageModule,
    CronModule,

    // Domain Modules
    AuthModule,
    ProfilesModule,
    GuestsModule,
    OnboardingModule,
    TagsModule,
    RecipesModule,
    PlannerModule,
    MealLogsModule,
    StreaksModule,
    NotificationsModule,
    SettingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
