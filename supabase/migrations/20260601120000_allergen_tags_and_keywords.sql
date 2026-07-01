-- Alérgenos: tags de sistema + keywords + vínculo onboarding (pregunta 2)

CREATE TABLE IF NOT EXISTS tag_keywords (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id     uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  keyword    text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT idx_tag_keywords_tag_keyword UNIQUE (tag_id, keyword)
);

INSERT INTO tags (profile_id, category, name, is_system_defined, icon_name)
SELECT NULL, 'allergens', v.name, true, v.icon_name
FROM (VALUES
  ('Maní',               'nut'),
  ('Frutos secos',       'trees'),
  ('Mariscos y pescado', 'fish'),
  ('Huevo',              'egg'),
  ('Lácteos',            'milk'),
  ('Gluten',             'wheat-off'),
  ('Soya',               'sprout')
) AS v(name, icon_name)
WHERE NOT EXISTS (
  SELECT 1 FROM tags t
  WHERE t.profile_id IS NULL AND t.category = 'allergens' AND t.name = v.name
);

INSERT INTO tag_keywords (tag_id, keyword)
SELECT t.id, k.keyword
FROM (VALUES
  ('Maní',               'maní'),
  ('Maní',               'mani'),
  ('Maní',               'cacahuate'),
  ('Maní',               'peanut'),
  ('Frutos secos',       'almendra'),
  ('Frutos secos',       'nuez'),
  ('Frutos secos',       'avellana'),
  ('Frutos secos',       'pistacho'),
  ('Frutos secos',       'castaña'),
  ('Frutos secos',       'macadamia'),
  ('Mariscos y pescado', 'camarón'),
  ('Mariscos y pescado', 'camaron'),
  ('Mariscos y pescado', 'pescado'),
  ('Mariscos y pescado', 'atún'),
  ('Mariscos y pescado', 'atun'),
  ('Mariscos y pescado', 'salmón'),
  ('Mariscos y pescado', 'salmon'),
  ('Mariscos y pescado', 'marisco'),
  ('Mariscos y pescado', 'calamar'),
  ('Mariscos y pescado', 'pulpo'),
  ('Huevo',              'huevo'),
  ('Huevo',              'yema'),
  ('Huevo',              'clara'),
  ('Lácteos',            'leche'),
  ('Lácteos',            'queso'),
  ('Lácteos',            'mantequilla'),
  ('Lácteos',            'crema'),
  ('Lácteos',            'yogurt'),
  ('Lácteos',            'lácteo'),
  ('Lácteos',            'lacteo'),
  ('Gluten',             'gluten'),
  ('Gluten',             'trigo'),
  ('Gluten',             'harina'),
  ('Gluten',             'pan'),
  ('Gluten',             'cebada'),
  ('Gluten',             'centeno'),
  ('Gluten',             'avena'),
  ('Soya',               'soya'),
  ('Soya',               'soja'),
  ('Soya',               'tofu')
) AS k(allergen_name, keyword)
JOIN tags t ON t.name = k.allergen_name AND t.category = 'allergens' AND t.profile_id IS NULL
ON CONFLICT (tag_id, keyword) DO NOTHING;

UPDATE onboarding_options oo
SET linked_tag_id = t.id,
    updated_at = now()
FROM onboarding_questions oq,
     tags t
WHERE oo.question_id = oq.id
  AND oq.sort_order = 2
  AND oo.label = t.name
  AND t.category = 'allergens'
  AND t.profile_id IS NULL
  AND oo.linked_tag_id IS NULL;
