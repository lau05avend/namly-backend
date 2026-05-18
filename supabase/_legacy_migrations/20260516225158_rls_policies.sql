-- =========================================================
-- ENABLE RLS
-- =========================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_sessions ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_platform_settings ENABLE ROW LEVEL SECURITY;

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_onboarding_responses ENABLE ROW LEVEL SECURITY;

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_folder_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_recipe_interactions ENABLE ROW LEVEL SECURITY; /* Revisar implementacion futura de RLS */
ALTER TABLE recipe_tag_links ENABLE ROW LEVEL SECURITY;

ALTER TABLE meal_types ENABLE ROW LEVEL SECURITY;

ALTER TABLE scheduled_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_meal_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_meal_reminders ENABLE ROW LEVEL SECURITY;

ALTER TABLE meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_logs_tag_links ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_daily_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- FORCE RLS
-- =========================================================

ALTER TABLE profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE meal_logs FORCE ROW LEVEL SECURITY;
ALTER TABLE scheduled_meals FORCE ROW LEVEL SECURITY;
ALTER TABLE recipes FORCE ROW LEVEL SECURITY;

-- =========================================================
-- PUBLIC READ TABLES
-- =========================================================

ALTER TABLE measurement_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_read_measurement_units"
ON measurement_units
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_read_onboarding_questions"
ON onboarding_questions
FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "authenticated_read_onboarding_options"
ON onboarding_options
FOR SELECT
TO authenticated
USING (is_active = true);

-- =========================================================
-- PROFILES
-- =========================================================

CREATE POLICY "profiles_select_own"
ON profiles
FOR SELECT
USING (
  id = auth.uid()
);

CREATE POLICY "profiles_insert_own"
ON profiles
FOR INSERT
WITH CHECK (
  id = auth.uid()
);

CREATE POLICY "profiles_update_own"
ON profiles
FOR UPDATE
USING (
  id = auth.uid()
);

-- =========================================================
-- AUTH IDENTITIES
-- =========================================================

CREATE POLICY "auth_identities_select_own"
ON auth_identities
FOR SELECT
USING (
  profile_id = auth.uid()
);

-- =========================================================
-- GUEST SESSIONS
-- =========================================================

CREATE POLICY "guest_sessions_select_own"
ON guest_sessions
FOR SELECT
USING (
  profile_id = auth.uid()
);

-- =========================================================
-- USER SETTINGS
-- =========================================================

CREATE POLICY "settings_all_own"
ON user_platform_settings
FOR ALL
USING (
  profile_id = auth.uid()
)
WITH CHECK (
  profile_id = auth.uid()
);

-- =========================================================
-- TAGS
-- =========================================================

CREATE POLICY "tags_select_available"
ON tags
FOR SELECT
USING (
  (
    is_system_defined = true
    AND deleted_at IS NULL
  )
  OR (
    profile_id = auth.uid()
    AND deleted_at IS NULL
  )
);

CREATE POLICY "tags_insert_own"
ON tags
FOR INSERT
WITH CHECK (
  profile_id = auth.uid()
);

CREATE POLICY "tags_update_own"
ON tags
FOR UPDATE
USING (
  profile_id = auth.uid()
);

-- =========================================================
-- USER ONBOARDING RESPONSES
-- =========================================================

CREATE POLICY "onboarding_responses_all_own"
ON user_onboarding_responses
FOR ALL
USING (
  profile_id = auth.uid()
)
WITH CHECK (
  profile_id = auth.uid()
);

-- =========================================================
-- RECIPES
-- =========================================================

CREATE POLICY "recipes_select_available"
ON recipes
FOR SELECT
USING (
  (
    is_public = true
    AND deleted_at IS NULL
  )
  OR (
    is_suggested = true
    AND deleted_at IS NULL
  )
  OR (
    profile_id = auth.uid()
    AND deleted_at IS NULL
  )
);

CREATE POLICY "recipes_insert_own"
ON recipes
FOR INSERT
WITH CHECK (
  profile_id = auth.uid()
);

CREATE POLICY "recipes_update_own"
ON recipes
FOR UPDATE
USING (
  profile_id = auth.uid()
);

-- =========================================================
-- RECIPE FOLDERS
-- =========================================================

CREATE POLICY "recipe_folders_all_own"
ON recipe_folders
FOR ALL
USING (
  profile_id = auth.uid()
)
WITH CHECK (
  profile_id = auth.uid()
);

-- =========================================================
-- MEAL TYPES
-- =========================================================

CREATE POLICY "meal_types_select_available"
ON meal_types
FOR SELECT
USING (
  (
    is_system_defined = true
    AND deleted_at IS NULL
  )
  OR (
    profile_id = auth.uid()
    AND deleted_at IS NULL
  )
);

CREATE POLICY "meal_types_insert_own"
ON meal_types
FOR INSERT
WITH CHECK (
  profile_id = auth.uid()
);

CREATE POLICY "meal_types_update_own"
ON meal_types
FOR UPDATE
USING (
  profile_id = auth.uid()
);

-- =========================================================
-- SCHEDULED MEALS
-- =========================================================

CREATE POLICY "scheduled_meals_all_own"
ON scheduled_meals
FOR ALL
USING (
  profile_id = auth.uid()
)
WITH CHECK (
  profile_id = auth.uid()
);

-- =========================================================
-- MEAL LOGS
-- =========================================================

CREATE POLICY "meal_logs_all_own"
ON meal_logs
FOR ALL
USING (
  profile_id = auth.uid()
)
WITH CHECK (
  profile_id = auth.uid()
);

-- =========================================================
-- USER DAILY ACTIVITY
-- =========================================================

CREATE POLICY "daily_activity_all_own"
ON user_daily_activity
FOR ALL
USING (
  profile_id = auth.uid()
)
WITH CHECK (
  profile_id = auth.uid()
);

-- =========================================================
-- USER STREAKS
-- =========================================================

CREATE POLICY "streaks_all_own"
ON user_streaks
FOR ALL
USING (
  profile_id = auth.uid()
)
WITH CHECK (
  profile_id = auth.uid()
);

-- =========================================================
-- NOTIFICATIONS
-- =========================================================

CREATE POLICY "notifications_all_own"
ON notifications
FOR ALL
USING (
  profile_id = auth.uid()
)
WITH CHECK (
  profile_id = auth.uid()
);