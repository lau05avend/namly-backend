CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================
-- PROFILES
-- =========================================================

CREATE TABLE "profiles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "display_name" text,
  "avatar_url" text,

  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

-- =========================================================
-- AUTH
-- =========================================================

CREATE TABLE "auth_identities" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  "profile_id" uuid NOT NULL,

  "provider" text NOT NULL,
  "external_id" text NOT NULL,
  "email" text,

  "last_sign_in" timestamptz,

  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "guest_sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  "profile_id" uuid NOT NULL,

  "device_id" text NOT NULL,

  "expires_at" timestamptz NOT NULL,

  "created_at" timestamptz NOT NULL DEFAULT now(),
  "last_active_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

-- =========================================================
-- SETTINGS
-- =========================================================

CREATE TABLE "measurement_units" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  "name" text NOT NULL,
  "abbreviation" text NOT NULL,
  "category" text NOT NULL,

  "is_convertible" boolean NOT NULL DEFAULT false,
  "is_active" boolean NOT NULL DEFAULT true,
  "is_default" boolean NOT NULL DEFAULT false,

  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "user_platform_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  "profile_id" uuid NOT NULL UNIQUE,

  "weight_unit_id" uuid,
  "volume_unit_id" uuid,

  "language" text,
  "theme" text,

  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

-- =========================================================
-- TAGS
-- =========================================================

CREATE TABLE "tags" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  "profile_id" uuid,

  "category" text NOT NULL,
  "name" text NOT NULL,
  "icon_name" text,

  "is_system_defined" boolean NOT NULL DEFAULT false,
  "is_visible" boolean NOT NULL DEFAULT true,

  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),

  "deleted_at" timestamptz
);

-- =========================================================
-- ONBOARDING
-- =========================================================

CREATE TABLE "onboarding_questions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  "question_text" text NOT NULL,
  "input_type" text NOT NULL,

  "allow_custom_input" boolean NOT NULL DEFAULT false,
  "is_active" boolean NOT NULL DEFAULT true,

  "sort_order" int NOT NULL,

  "allow_multiple" boolean NOT NULL DEFAULT false,
  "max_selections" int,

  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()

  CHECK (
    "max_selections" IS NULL
    OR "max_selections" > 0
  )
);

CREATE TABLE "onboarding_options" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  "question_id" uuid NOT NULL,
  "linked_tag_id" uuid,

  "label" text NOT NULL,
  "icon_name" text,

  "is_default" boolean NOT NULL DEFAULT false,
  "is_active" boolean NOT NULL DEFAULT true,

  "sort_order" int NOT NULL,

  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "user_onboarding_responses" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  "profile_id" uuid NOT NULL,
  "question_id" uuid NOT NULL,
  "option_id" uuid,

  "custom_value" text,

  "created_at" timestamptz NOT NULL DEFAULT now()
);

-- =========================================================
-- RECIPES
-- =========================================================

CREATE TABLE "recipes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  "profile_id" uuid,

  "title" text NOT NULL,
  "description" text,
  "cover_url" text,

  "is_public" boolean NOT NULL DEFAULT false,
  "is_suggested" boolean NOT NULL DEFAULT false,

  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),

  "deleted_at" timestamptz
);

CREATE TABLE "recipe_folders" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  "profile_id" uuid NOT NULL,

  "name" text NOT NULL,
  "color_hex" text,

  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),

  "deleted_at" timestamptz
);

CREATE TABLE "recipe_folder_items" (
  "folder_id" uuid NOT NULL,
  "recipe_id" uuid NOT NULL,

  PRIMARY KEY ("folder_id", "recipe_id")
);

CREATE TABLE "recipe_steps" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  "recipe_id" uuid NOT NULL,

  "step_order" int NOT NULL,
  "description" text NOT NULL,

  "duration_minutes" int,

  "created_at" timestamptz NOT NULL DEFAULT now(),

  UNIQUE ("recipe_id", "step_order")
);

CREATE TABLE "recipe_ingredients" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  "recipe_id" uuid NOT NULL,
  "unit_id" uuid,

  "name" text NOT NULL,
  "quantity" numeric,

  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "user_recipe_interactions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  "recipe_id" uuid NOT NULL,
  "profile_id" uuid NOT NULL,

  "rating" integer,
  "public_comment" text,
  "private_notes" text,

  "is_favorite" boolean NOT NULL DEFAULT false,
  "is_hidden" boolean NOT NULL DEFAULT false,

  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),

  UNIQUE ("recipe_id", "profile_id"),

  CHECK ("rating" BETWEEN 1 AND 5)
);

-- =========================================================
-- PLANNER
-- =========================================================

CREATE TABLE "meal_types" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  "profile_id" uuid,

  "name" text NOT NULL,

  "sort_order" int NOT NULL,

  "is_system_defined" boolean NOT NULL DEFAULT false,
  "is_visible" boolean NOT NULL DEFAULT true,

  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),

  "deleted_at" timestamptz
);

CREATE TABLE "scheduled_meals" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  "profile_id" uuid NOT NULL,
  "meal_type_id" uuid NOT NULL,

  "entry_date" date NOT NULL,
  "planned_time" time NOT NULL,

  "is_express" boolean NOT NULL DEFAULT false,
  "express_note" text,

  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),

  "deleted_at" timestamptz
);

CREATE TABLE "scheduled_meal_recipes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  "scheduled_meal_id" uuid NOT NULL,
  "recipe_id" uuid NOT NULL,

  "sort_order" int NOT NULL,

  "created_at" timestamptz NOT NULL DEFAULT now(),

  UNIQUE ("scheduled_meal_id", "recipe_id")
);

CREATE TABLE "scheduled_meal_reminders" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  "scheduled_meal_id" uuid NOT NULL,

  "reminder_time" time NOT NULL,

  "is_notified" boolean NOT NULL DEFAULT false,
  "is_active" boolean NOT NULL DEFAULT true,

  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

-- =========================================================
-- MEAL LOGS
-- =========================================================

CREATE TABLE "meal_logs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  "profile_id" uuid NOT NULL,

  "meal_type_id" uuid,
  "scheduled_meal_id" uuid,
  "recipe_id" uuid,

  "media_url" text,

  "content" text,
  "score" int,
  "notes" text,

  "logged_at" timestamptz NOT NULL,

  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),

  "deleted_at" timestamptz,

  CHECK ("score" BETWEEN 1 AND 5)
);

CREATE TABLE "meal_logs_tag_links" (
  "tag_id" uuid NOT NULL,
  "meal_logs_id" uuid NOT NULL,

  PRIMARY KEY ("tag_id", "meal_logs_id")
);

-- =========================================================
-- STREAKS
-- =========================================================

CREATE TABLE "user_daily_activity" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  "profile_id" uuid NOT NULL,

  "date" date NOT NULL,
  "week_start" date,

  "meals_planned" int NOT NULL DEFAULT 0,
  "meals_registered" int NOT NULL DEFAULT 0,

  "completion_percentage" numeric,

  "counts_for_streak" boolean NOT NULL DEFAULT false,

  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),

  CHECK (
    "completion_percentage" >= 0
    AND "completion_percentage" <= 100
  )
);

CREATE TABLE "user_streaks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  "profile_id" uuid NOT NULL,

  "current_streak" int NOT NULL DEFAULT 0,
  "longest_streak" int NOT NULL DEFAULT 0,

  "last_active_date" date,

  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

-- =========================================================
-- RECIPE TAG LINKS
-- =========================================================

CREATE TABLE "recipe_tag_links" (
  "recipe_id" uuid NOT NULL,
  "tag_id" uuid NOT NULL,

  PRIMARY KEY ("recipe_id", "tag_id")
);

-- =========================================================
-- NOTIFICATIONS
-- =========================================================

CREATE TABLE "notifications" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  "profile_id" uuid NOT NULL,

  "type" text NOT NULL,

  "title" text NOT NULL,
  "body" text,

  "is_read" boolean NOT NULL DEFAULT false,
  "read_at" timestamptz,

  "related_entity_id" uuid,
  "related_entity_type" text,

  "created_at" timestamptz NOT NULL DEFAULT now()
);

-- =========================================================
-- INDEXES
-- =========================================================

CREATE UNIQUE INDEX idx_measurement_units_default_category
ON measurement_units(category)
WHERE is_default = true;

CREATE UNIQUE INDEX idx_user_daily_activity_profile_date
ON user_daily_activity(profile_id, date);

CREATE INDEX idx_scheduled_meals_profile_date
ON scheduled_meals(profile_id, entry_date);

CREATE INDEX idx_meal_logs_profile_logged_at
ON meal_logs(profile_id, logged_at);

CREATE INDEX idx_reminders_active
ON scheduled_meal_reminders(is_active, is_notified);

CREATE INDEX idx_notifications_profile_read
ON notifications(profile_id, is_read);

CREATE INDEX idx_tags_profile_deleted
ON tags(profile_id, deleted_at);

CREATE INDEX idx_recipes_profile_deleted
ON recipes(profile_id, deleted_at);

CREATE INDEX idx_meal_logs_profile_deleted
ON meal_logs(profile_id, deleted_at);

-- =========================================================
-- COMMENTS
-- =========================================================

COMMENT ON COLUMN "tags"."profile_id"
IS 'Vínculo opcional';

COMMENT ON COLUMN "recipes"."profile_id"
IS 'Vínculo opcional';

COMMENT ON COLUMN "user_recipe_interactions"."rating"
IS '1-5 estrellas';

COMMENT ON COLUMN "user_recipe_interactions"."public_comment"
IS 'Lo que otros usuarios ven';

COMMENT ON COLUMN "user_recipe_interactions"."private_notes"
IS 'Solo para el autor del registro';

COMMENT ON COLUMN "meal_types"."profile_id"
IS 'Vínculo opcional';

COMMENT ON COLUMN "meal_logs"."scheduled_meal_id"
IS 'Vínculo opcional';

COMMENT ON COLUMN "meal_logs"."content"
IS 'Descripción objetiva/IA';

COMMENT ON COLUMN "meal_logs"."notes"
IS 'Comentario subjetivo usuario';

-- =========================================================
-- FOREIGN KEYS
-- =========================================================

ALTER TABLE "auth_identities"
ADD FOREIGN KEY ("profile_id")
REFERENCES "profiles" ("id");

ALTER TABLE "guest_sessions"
ADD FOREIGN KEY ("profile_id")
REFERENCES "profiles" ("id");

ALTER TABLE "user_platform_settings"
ADD FOREIGN KEY ("profile_id")
REFERENCES "profiles" ("id");

ALTER TABLE "user_platform_settings"
ADD FOREIGN KEY ("weight_unit_id")
REFERENCES "measurement_units" ("id");

ALTER TABLE "user_platform_settings"
ADD FOREIGN KEY ("volume_unit_id")
REFERENCES "measurement_units" ("id");

ALTER TABLE "tags"
ADD FOREIGN KEY ("profile_id")
REFERENCES "profiles" ("id");

ALTER TABLE "onboarding_options"
ADD FOREIGN KEY ("question_id")
REFERENCES "onboarding_questions" ("id");

ALTER TABLE "onboarding_options"
ADD FOREIGN KEY ("linked_tag_id")
REFERENCES "tags" ("id");

ALTER TABLE "user_onboarding_responses"
ADD FOREIGN KEY ("profile_id")
REFERENCES "profiles" ("id");

ALTER TABLE "user_onboarding_responses"
ADD FOREIGN KEY ("question_id")
REFERENCES "onboarding_questions" ("id");

ALTER TABLE "user_onboarding_responses"
ADD FOREIGN KEY ("option_id")
REFERENCES "onboarding_options" ("id");

ALTER TABLE "recipes"
ADD FOREIGN KEY ("profile_id")
REFERENCES "profiles" ("id");

ALTER TABLE "recipe_folders"
ADD FOREIGN KEY ("profile_id")
REFERENCES "profiles" ("id");

ALTER TABLE "recipe_folder_items"
ADD FOREIGN KEY ("folder_id")
REFERENCES "recipe_folders" ("id");

ALTER TABLE "recipe_folder_items"
ADD FOREIGN KEY ("recipe_id")
REFERENCES "recipes" ("id");

ALTER TABLE "recipe_steps"
ADD FOREIGN KEY ("recipe_id")
REFERENCES "recipes" ("id");

ALTER TABLE "recipe_ingredients"
ADD FOREIGN KEY ("recipe_id")
REFERENCES "recipes" ("id");

ALTER TABLE "recipe_ingredients"
ADD FOREIGN KEY ("unit_id")
REFERENCES "measurement_units" ("id");

ALTER TABLE "user_recipe_interactions"
ADD FOREIGN KEY ("recipe_id")
REFERENCES "recipes" ("id");

ALTER TABLE "user_recipe_interactions"
ADD FOREIGN KEY ("profile_id")
REFERENCES "profiles" ("id");

ALTER TABLE "meal_types"
ADD FOREIGN KEY ("profile_id")
REFERENCES "profiles" ("id");

ALTER TABLE "scheduled_meals"
ADD FOREIGN KEY ("profile_id")
REFERENCES "profiles" ("id");

ALTER TABLE "scheduled_meals"
ADD FOREIGN KEY ("meal_type_id")
REFERENCES "meal_types" ("id");

ALTER TABLE "scheduled_meal_recipes"
ADD FOREIGN KEY ("scheduled_meal_id")
REFERENCES "scheduled_meals" ("id");

ALTER TABLE "scheduled_meal_recipes"
ADD FOREIGN KEY ("recipe_id")
REFERENCES "recipes" ("id");

ALTER TABLE "scheduled_meal_reminders"
ADD FOREIGN KEY ("scheduled_meal_id")
REFERENCES "scheduled_meals" ("id");

ALTER TABLE "meal_logs"
ADD FOREIGN KEY ("profile_id")
REFERENCES "profiles" ("id");

ALTER TABLE "meal_logs"
ADD FOREIGN KEY ("meal_type_id")
REFERENCES "meal_types" ("id");

ALTER TABLE "meal_logs"
ADD FOREIGN KEY ("scheduled_meal_id")
REFERENCES "scheduled_meals" ("id");

ALTER TABLE "meal_logs"
ADD FOREIGN KEY ("recipe_id")
REFERENCES "recipes" ("id");

ALTER TABLE "meal_logs_tag_links"
ADD FOREIGN KEY ("tag_id")
REFERENCES "tags" ("id");

ALTER TABLE "meal_logs_tag_links"
ADD FOREIGN KEY ("meal_logs_id")
REFERENCES "meal_logs" ("id");

ALTER TABLE "user_daily_activity"
ADD FOREIGN KEY ("profile_id")
REFERENCES "profiles" ("id");

ALTER TABLE "user_streaks"
ADD FOREIGN KEY ("profile_id")
REFERENCES "profiles" ("id");

ALTER TABLE "recipe_tag_links"
ADD FOREIGN KEY ("recipe_id")
REFERENCES "recipes" ("id");

ALTER TABLE "recipe_tag_links"
ADD FOREIGN KEY ("tag_id")
REFERENCES "tags" ("id");

ALTER TABLE "notifications"
ADD FOREIGN KEY ("profile_id")
REFERENCES "profiles" ("id");