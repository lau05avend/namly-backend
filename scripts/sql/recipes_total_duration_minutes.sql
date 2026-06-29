-- =============================================================================
-- Namly: recipes.total_duration_minutes
-- =============================================================================
-- Aplicar manualmente en Supabase SQL Editor (o psql). NO usar `prisma migrate`.
-- Después: `pnpm exec prisma generate` en el backend.
--
-- Semántica (igual que la API):
--   - Suma de recipe_steps.duration_minutes (NULL cuenta como 0)
--   - NULL si la suma es 0 (receta sin tiempos configurados)
-- =============================================================================

BEGIN;

-- 1) Diagnóstico (opcional; comentar si ya revisaste)
-- SELECT column_name FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'recipes' AND column_name = 'total_duration_minutes';

-- 2) Columna nueva
ALTER TABLE recipes
  ADD COLUMN IF NOT EXISTS total_duration_minutes INTEGER;

-- 3) Backfill desde pasos existentes
UPDATE recipes r
SET total_duration_minutes = totals.computed_minutes
FROM (
  SELECT
    rs.recipe_id,
    CASE
      WHEN COALESCE(SUM(COALESCE(rs.duration_minutes, 0)), 0) > 0
      THEN SUM(COALESCE(rs.duration_minutes, 0))::INTEGER
      ELSE NULL
    END AS computed_minutes
  FROM recipe_steps rs
  GROUP BY rs.recipe_id
) AS totals
WHERE r.id = totals.recipe_id
  AND r.deleted_at IS NULL;

-- Recetas sin pasos o sin tiempos quedan en NULL (comportamiento esperado)

COMMIT;

-- 4) Verificación
SELECT
  id,
  title,
  total_duration_minutes
FROM recipes
WHERE deleted_at IS NULL
ORDER BY updated_at DESC
LIMIT 20;
