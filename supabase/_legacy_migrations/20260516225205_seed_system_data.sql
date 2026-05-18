-- =========================================================
-- MEASUREMENT UNITS
-- =========================================================

INSERT INTO measurement_units (
  name,
  abbreviation,
  category,
  is_convertible,
  is_default
)
VALUES
-- Peso
('Gramo',      'g',   'weight', true,  true),   -- default peso
('Kilogramo',  'kg',  'weight', true,  false),
('Libra',      'lb',  'weight', true,  false),   -- muy usado en mercados colombianos
('Onza',       'oz',  'weight', true,  false),
('Tonelada',    't',   'weight', true,  false),

-- Volumen cocina
('Mililitro',  'ml',  'volume', true,  true),    -- default volumen
('Litro',      'l',   'volume', true,  false),
('Taza',       'cup', 'volume', false, false),   -- ~240ml, no convertible exacto
('Cucharada',  'tbsp','volume', false, false),   -- ~15ml
('Cucharadita','tsp', 'volume', false, false),   -- ~5ml

-- Conteo
('Unidad',     'und', 'count',  false, true),    -- default conteo
('Porción',    'porc','count',  false, false),
('Rebanada',   'reb', 'count',  false, false),
('Manojo',     'manj','count',  false, false),
('Pizca',      'pizca','count', false, false),
('Al gusto',   'c/n', 'count',  false, false);

-- =========================================================
-- SYSTEM MEAL TYPES - predefinidos del sistema
-- =========================================================

INSERT INTO meal_types (
  profile_id,
  name,
  sort_order,
  is_system_defined
)
VALUES
(null, 'Desayuno',       1, true),
(null, 'Media mañana',   2, true),
(null, 'Almuerzo',       3, true),
(null, 'Merienda',       4, true),
(null, 'Cena',           5, true),
(null, 'Snack',          6, true);

-- =========================================================
-- SYSTEM TAGS
-- =========================================================

-- ══════════════════════════════
-- TAGS DE RECETAS
-- ══════════════════════════════
INSERT INTO tags (
  profile_id,
  category,
  name,
  is_system_defined,
  icon_name
)
VALUES
-- Tipo de dieta
(NULL, 'recipes', 'Vegetariano',     true, 'leaf'),
(NULL, 'recipes', 'Vegano',          true, 'sprout'),
(NULL, 'recipes', 'Sin gluten',      true, 'wheat-off'),
(NULL, 'recipes', 'Sin lactosa',     true, 'milk-off'),
(NULL, 'recipes', 'Alto en proteína',true, 'dumbbell'),
(NULL, 'recipes', 'Bajo en sodio',   true, 'droplets'),
(NULL, 'recipes', 'Sin azúcar',      true, 'candy-off'),

-- Tipo de cocina
(NULL, 'recipes', 'Colombiano',      true, 'map-pin'),
(NULL, 'recipes', 'Mediterráneo',    true, 'sun'),
(NULL, 'recipes', 'Asiático',        true, 'globe'),
(NULL, 'recipes', 'Latinoamericano', true, 'map'),
(NULL, 'recipes', 'Mexicano', true, 'cooking-pot'),
(NULL, 'recipes', 'Italiano', true, 'pizza'),

-- Método de preparación
(NULL, 'recipes', 'Rápido',          true, 'timer'),
(NULL, 'recipes', 'Al horno',        true, 'flame'),
(NULL, 'recipes', 'Ensalada',        true, 'salad'),
(NULL, 'recipes', 'Sopa',            true, 'soup'),
(NULL, 'recipes', 'Bebida',          true, 'cup-soda'),
(NULL, 'recipes', 'A la plancha',    true, 'hand-platter'),

-- ══════════════════════════════
-- TAGS DE REGISTROS (meal_logs)
-- ══════════════════════════════

-- Origen de la comida
(NULL, 'meal_logs', 'Casero',         true, 'house'),
(NULL, 'meal_logs', 'Restaurante',    true, 'utensils'),
(NULL, 'meal_logs', 'Delivery',       true, 'package'),
(NULL, 'meal_logs', 'Cafetería',      true, 'coffee'),
(NULL, 'meal_logs', 'En la calle',    true, 'store'),

-- Contexto social
(NULL, 'meal_logs', 'Solo',           true, 'user'),
(NULL, 'meal_logs', 'En familia',     true, 'users'),
(NULL, 'meal_logs', 'Con amigos',     true, 'smile'),
(NULL, 'meal_logs', 'En el trabajo',  true, 'briefcase'),

-- Contexto emocional
(NULL, 'meal_logs', 'Antojo',         true, 'heart'),
(NULL, 'meal_logs', 'Por necesidad',  true, 'clock'),
(NULL, 'meal_logs', 'Celebración',    true, 'party-popper'),
(NULL, 'meal_logs', 'Estrés',         true, 'zap'),
(NULL, 'meal_logs', 'Rutina',         true, 'repeat'),
(NULL, 'meal_logs', 'Me consentí',    true, 'sparkles'),
(NULL, 'meal_logs', 'Saludable',      true, 'leaf');

-- =========================================================
-- ONBOARDING QUESTIONS
-- =========================================================

INSERT INTO onboarding_questions (
  question_text, input_type, allow_custom_input,
  allow_multiple, max_selections, sort_order
) VALUES
('¿Cómo está tu relación con la comida en este momento?', 'single_select', false, false, 1, 1),
('¿Tienes alguna alergia o algo que prefieras evitar?',   'multi_select',  true,  true,  null, 2),
('¿Cómo describes tu forma de comer?',                    'multi_select',  false, true,  null, 3),
('¿Qué tipo de comida te hace feliz?',                    'multi_select',  false, true,  3,    4),
('¿Qué tanto cocinas en casa?',                           'single_select', false, false, 1,    5);

-- ══════════════════════════════════════════════
--ONBOARDING OPTIONS
-- ══════════════════════════════════════════════

-- Pregunta 1 — relación con la comida
INSERT INTO onboarding_options (question_id, label, icon_name, is_default, sort_order, linked_tag_id)
VALUES
((SELECT id FROM onboarding_questions WHERE sort_order = 1), 'Como sin mucho orden, quiero mejorar eso',    'sparkles',     false, 1, null),
((SELECT id FROM onboarding_questions WHERE sort_order = 1), 'Ya cuido lo que como, quiero organizarme',   'list-checks',  false, 2, null),
((SELECT id FROM onboarding_questions WHERE sort_order = 1), 'Busco inspiración para cocinar distinto',    'chef-hat',     false, 3, null),
((SELECT id FROM onboarding_questions WHERE sort_order = 1), 'Quiero llevar un registro sin complicarme', 'notebook-pen', false, 4, null),
((SELECT id FROM onboarding_questions WHERE sort_order = 1), 'Estoy empezando a prestarle atención',      'seedling',     false, 5, null);

-- Pregunta 2 — alergias
INSERT INTO onboarding_options (question_id, label, icon_name, is_default, sort_order, linked_tag_id)
VALUES
((SELECT id FROM onboarding_questions WHERE sort_order = 2), 'Maní',                    'nut',          false, 1, null),
((SELECT id FROM onboarding_questions WHERE sort_order = 2), 'Frutos secos',            'trees',        false, 2, null),
((SELECT id FROM onboarding_questions WHERE sort_order = 2), 'Mariscos y pescado',      'fish',         false, 3, null),
((SELECT id FROM onboarding_questions WHERE sort_order = 2), 'Huevo',                   'egg',          false, 4, null),
((SELECT id FROM onboarding_questions WHERE sort_order = 2), 'Lácteos',                 'milk',         false, 5, null),
((SELECT id FROM onboarding_questions WHERE sort_order = 2), 'Gluten',                  'wheat-off',    false, 6, null),
((SELECT id FROM onboarding_questions WHERE sort_order = 2), 'Soya',                    'sprout',       false, 7, null),
((SELECT id FROM onboarding_questions WHERE sort_order = 2), 'Ninguna por ahora',       'check-circle', true,  8, null);

-- Pregunta 3 — forma de comer
INSERT INTO onboarding_options (question_id, label, icon_name, is_default, sort_order, linked_tag_id)
VALUES
((SELECT id FROM onboarding_questions WHERE sort_order = 3), 'Vegetariano',             'leaf',         false, 1, (SELECT id FROM tags WHERE name = 'Vegetariano'   AND category = 'recipes')),
((SELECT id FROM onboarding_questions WHERE sort_order = 3), 'Vegano',                  'sprout',       false, 2, (SELECT id FROM tags WHERE name = 'Vegano'        AND category = 'recipes')),
((SELECT id FROM onboarding_questions WHERE sort_order = 3), 'Sin gluten',              'wheat-off',    false, 3, (SELECT id FROM tags WHERE name = 'Sin gluten'    AND category = 'recipes')),
((SELECT id FROM onboarding_questions WHERE sort_order = 3), 'Sin lácteos',             'milk-off',     false, 4, (SELECT id FROM tags WHERE name = 'Sin lactosa'   AND category = 'recipes')),
((SELECT id FROM onboarding_questions WHERE sort_order = 3), 'Bajo en sodio',           'droplets',     false, 5, (SELECT id FROM tags WHERE name = 'Bajo en sodio' AND category = 'recipes')),
((SELECT id FROM onboarding_questions WHERE sort_order = 3), 'Sin azúcar añadida',      'candy-off',    false, 6, (SELECT id FROM tags WHERE name = 'Sin azúcar'    AND category = 'recipes')),
((SELECT id FROM onboarding_questions WHERE sort_order = 3), 'Keto / bajo en carbos',   'zap',          false, 7, null),
((SELECT id FROM onboarding_questions WHERE sort_order = 3), 'Ayuno intermitente',      'clock',        false, 8, null),
((SELECT id FROM onboarding_questions WHERE sort_order = 3), 'Sin restricciones',       'check-circle', true,  9, null);

-- Pregunta 4 — tipo de comida favorita (máx. 3)
INSERT INTO onboarding_options (question_id, label, icon_name, is_default, sort_order, linked_tag_id)
VALUES
((SELECT id FROM onboarding_questions WHERE sort_order = 4), 'Comida colombiana',       'map-pin',      false, 1, (SELECT id FROM tags WHERE name = 'Colombiano'       AND category = 'recipes')),
((SELECT id FROM onboarding_questions WHERE sort_order = 4), 'Latinoamericana',         'map',          false, 2, (SELECT id FROM tags WHERE name = 'Latinoamericano'  AND category = 'recipes')),
((SELECT id FROM onboarding_questions WHERE sort_order = 4), 'Mediterránea',            'sun',          false, 3, (SELECT id FROM tags WHERE name = 'Mediterráneo'     AND category = 'recipes')),
((SELECT id FROM onboarding_questions WHERE sort_order = 4), 'Asiática',                'globe',        false, 4, (SELECT id FROM tags WHERE name = 'Asiático'         AND category = 'recipes')),
((SELECT id FROM onboarding_questions WHERE sort_order = 4), 'Rápida y práctica',       'timer',        false, 5, (SELECT id FROM tags WHERE name = 'Rápido'           AND category = 'recipes')),
((SELECT id FROM onboarding_questions WHERE sort_order = 4), 'Saludable y ligera',      'heart',        false, 6, null),
((SELECT id FROM onboarding_questions WHERE sort_order = 4), 'Comida de confort',       'home',         false, 7, null),
((SELECT id FROM onboarding_questions WHERE sort_order = 4), 'Me gusta todo',           'smile',        false, 8, null);

-- Pregunta 5 — frecuencia cocinando
INSERT INTO onboarding_options (question_id, label, icon_name, is_default, sort_order, linked_tag_id)
VALUES
((SELECT id FROM onboarding_questions WHERE sort_order = 5), 'Casi todos los días',                    'chef-hat',  false, 1, null),
((SELECT id FROM onboarding_questions WHERE sort_order = 5), 'Varias veces a la semana',               'calendar',  false, 2, null),
((SELECT id FROM onboarding_questions WHERE sort_order = 5), 'De vez en cuando',                       'clock',     false, 3, null),
((SELECT id FROM onboarding_questions WHERE sort_order = 5), 'Casi nunca, prefiero pedir o comprar',   'package',   false, 4, null);

-- =========================================================
-- RECIPES
-- =========================================================

INSERT INTO recipes (profile_id, title, description, is_public, is_suggested)
VALUES
(null, 'Ajiaco bogotano',      'Sopa tradicional colombiana con tres tipos de papa, pollo y guascas.',        true, true),
(null, 'Arroz con pollo',      'Clásico arroz con pollo al estilo casero colombiano, con verduras y azafrán.', true, true),
(null, 'Avena con frutas',     'Desayuno rápido y nutritivo con avena, leche y frutas frescas de temporada.', true, true);

-- ══════════════════════════════════════════════
-- RECIPES INGREDIENTS
-- ══════════════════════════════════════════════

-- Ajiaco bogotano
INSERT INTO recipe_ingredients (recipe_id, name, quantity, unit_id) VALUES
((SELECT id FROM recipes WHERE title = 'Ajiaco bogotano'), 'Pechuga de pollo',   500, (SELECT id FROM measurement_units WHERE abbreviation = 'g')),
((SELECT id FROM recipes WHERE title = 'Ajiaco bogotano'), 'Papa pastusa',       300, (SELECT id FROM measurement_units WHERE abbreviation = 'g')),
((SELECT id FROM recipes WHERE title = 'Ajiaco bogotano'), 'Papa criolla',       200, (SELECT id FROM measurement_units WHERE abbreviation = 'g')),
((SELECT id FROM recipes WHERE title = 'Ajiaco bogotano'), 'Papa sabanera',      200, (SELECT id FROM measurement_units WHERE abbreviation = 'g')),
((SELECT id FROM recipes WHERE title = 'Ajiaco bogotano'), 'Guascas',            1,   (SELECT id FROM measurement_units WHERE abbreviation = 'tbsp')),
((SELECT id FROM recipes WHERE title = 'Ajiaco bogotano'), 'Mazorca',            2,   (SELECT id FROM measurement_units WHERE abbreviation = 'und')),
((SELECT id FROM recipes WHERE title = 'Ajiaco bogotano'), 'Cebolla larga',      2,   (SELECT id FROM measurement_units WHERE abbreviation = 'und')),
((SELECT id FROM recipes WHERE title = 'Ajiaco bogotano'), 'Ajo',                3,   (SELECT id FROM measurement_units WHERE abbreviation = 'und')),
((SELECT id FROM recipes WHERE title = 'Ajiaco bogotano'), 'Agua',               2,   (SELECT id FROM measurement_units WHERE abbreviation = 'l')),
((SELECT id FROM recipes WHERE title = 'Ajiaco bogotano'), 'Sal',                1,   (SELECT id FROM measurement_units WHERE abbreviation = 'c/n')),
((SELECT id FROM recipes WHERE title = 'Ajiaco bogotano'), 'Crema de leche',     1,   (SELECT id FROM measurement_units WHERE abbreviation = 'cup')),
((SELECT id FROM recipes WHERE title = 'Ajiaco bogotano'), 'Alcaparras',         1,   (SELECT id FROM measurement_units WHERE abbreviation = 'tbsp'));

-- Arroz con pollo
INSERT INTO recipe_ingredients (recipe_id, name, quantity, unit_id) VALUES
((SELECT id FROM recipes WHERE title = 'Arroz con pollo'), 'Pechuga de pollo',   400, (SELECT id FROM measurement_units WHERE abbreviation = 'g')),
((SELECT id FROM recipes WHERE title = 'Arroz con pollo'), 'Arroz',              2,   (SELECT id FROM measurement_units WHERE abbreviation = 'cup')),
((SELECT id FROM recipes WHERE title = 'Arroz con pollo'), 'Caldo de pollo',     500, (SELECT id FROM measurement_units WHERE abbreviation = 'ml')),
((SELECT id FROM recipes WHERE title = 'Arroz con pollo'), 'Zanahoria',          1,   (SELECT id FROM measurement_units WHERE abbreviation = 'und')),
((SELECT id FROM recipes WHERE title = 'Arroz con pollo'), 'Arveja',             100, (SELECT id FROM measurement_units WHERE abbreviation = 'g')),
((SELECT id FROM recipes WHERE title = 'Arroz con pollo'), 'Pimentón rojo',      1,   (SELECT id FROM measurement_units WHERE abbreviation = 'und')),
((SELECT id FROM recipes WHERE title = 'Arroz con pollo'), 'Cebolla cabezona',   1,   (SELECT id FROM measurement_units WHERE abbreviation = 'und')),
((SELECT id FROM recipes WHERE title = 'Arroz con pollo'), 'Ajo',                3,   (SELECT id FROM measurement_units WHERE abbreviation = 'und')),
((SELECT id FROM recipes WHERE title = 'Arroz con pollo'), 'Azafrán',            1,   (SELECT id FROM measurement_units WHERE abbreviation = 'tsp')),
((SELECT id FROM recipes WHERE title = 'Arroz con pollo'), 'Aceite',             2,   (SELECT id FROM measurement_units WHERE abbreviation = 'tbsp')),
((SELECT id FROM recipes WHERE title = 'Arroz con pollo'), 'Sal y pimienta',     1,   (SELECT id FROM measurement_units WHERE abbreviation = 'c/n'));

-- Avena con frutas
INSERT INTO recipe_ingredients (recipe_id, name, quantity, unit_id) VALUES
((SELECT id FROM recipes WHERE title = 'Avena con frutas'), 'Avena en hojuelas',  1,   (SELECT id FROM measurement_units WHERE abbreviation = 'cup')),
((SELECT id FROM recipes WHERE title = 'Avena con frutas'), 'Leche',              250, (SELECT id FROM measurement_units WHERE abbreviation = 'ml')),
((SELECT id FROM recipes WHERE title = 'Avena con frutas'), 'Banano',             1,   (SELECT id FROM measurement_units WHERE abbreviation = 'und')),
((SELECT id FROM recipes WHERE title = 'Avena con frutas'), 'Fresas',             100, (SELECT id FROM measurement_units WHERE abbreviation = 'g')),
((SELECT id FROM recipes WHERE title = 'Avena con frutas'), 'Miel',               1,   (SELECT id FROM measurement_units WHERE abbreviation = 'tbsp')),
((SELECT id FROM recipes WHERE title = 'Avena con frutas'), 'Canela',             1,   (SELECT id FROM measurement_units WHERE abbreviation = 'pizca'));

-- ══════════════════════════════════════════════
-- PASOS
-- ══════════════════════════════════════════════

-- Ajiaco bogotano
INSERT INTO recipe_steps (recipe_id, step_order, description, duration_minutes) VALUES
((SELECT id FROM recipes WHERE title = 'Ajiaco bogotano'), 1, 'Cocinar el pollo con agua, cebolla, ajo y sal a fuego medio hasta que esté tierno. Reservar el caldo y desmechar el pollo.',                    25),
((SELECT id FROM recipes WHERE title = 'Ajiaco bogotano'), 2, 'En el mismo caldo, agregar la papa pastusa y la sabanera en trozos. Cocinar 15 minutos a fuego medio.',                                          15),
((SELECT id FROM recipes WHERE title = 'Ajiaco bogotano'), 3, 'Agregar la papa criolla, la mazorca en rodajas y las guascas. Cocinar 20 minutos más hasta que la papa criolla espese el caldo.',               20),
((SELECT id FROM recipes WHERE title = 'Ajiaco bogotano'), 4, 'Incorporar el pollo desmechado y ajustar sal. Servir con crema de leche y alcaparras al lado.',                                                   5);

-- Arroz con pollo
INSERT INTO recipe_steps (recipe_id, step_order, description, duration_minutes) VALUES
((SELECT id FROM recipes WHERE title = 'Arroz con pollo'), 1, 'Sazonar el pollo con sal, pimienta y ajo. Dorar en aceite caliente por ambos lados hasta sellar. Retirar y reservar.',                           8),
((SELECT id FROM recipes WHERE title = 'Arroz con pollo'), 2, 'En el mismo aceite, sofreír la cebolla, el pimentón y la zanahoria en cubos durante 5 minutos.',                                                  5),
((SELECT id FROM recipes WHERE title = 'Arroz con pollo'), 3, 'Agregar el arroz y el azafrán. Revolver para cubrir con el sofrito. Incorporar el caldo caliente y las arvejas.',                                 3),
((SELECT id FROM recipes WHERE title = 'Arroz con pollo'), 4, 'Poner el pollo encima del arroz, tapar y cocinar a fuego bajo por 20 minutos hasta que el arroz absorba el caldo.',                              20),
((SELECT id FROM recipes WHERE title = 'Arroz con pollo'), 5, 'Retirar del fuego y dejar reposar 5 minutos antes de servir.',                                                                                    5);

-- Avena con frutas
INSERT INTO recipe_steps (recipe_id, step_order, description, duration_minutes) VALUES
((SELECT id FROM recipes WHERE title = 'Avena con frutas'), 1, 'Calentar la leche en una olla a fuego medio. Cuando esté tibia, agregar la avena y la canela. Revolver constantemente.',                          5),
((SELECT id FROM recipes WHERE title = 'Avena con frutas'), 2, 'Cocinar a fuego bajo por 5 minutos hasta obtener una consistencia cremosa. Agregar miel y mezclar.',                                              5),
((SELECT id FROM recipes WHERE title = 'Avena con frutas'), 3, 'Servir en un tazón y decorar con el banano en rodajas y las fresas cortadas por la mitad.',                                                       2);

-- ══════════════════════════════════════════════
-- TAGS DE RECETAS
-- ══════════════════════════════════════════════
INSERT INTO recipe_tag_links (recipe_id, tag_id) VALUES
-- Ajiaco
((SELECT id FROM recipes WHERE title = 'Ajiaco bogotano'), (SELECT id FROM tags WHERE name = 'Colombiano'        AND category = 'recipes')),
((SELECT id FROM recipes WHERE title = 'Ajiaco bogotano'), (SELECT id FROM tags WHERE name = 'Alto en proteína'  AND category = 'recipes')),
((SELECT id FROM recipes WHERE title = 'Ajiaco bogotano'), (SELECT id FROM tags WHERE name = 'Sopa'              AND category = 'recipes')),
-- Arroz con pollo
((SELECT id FROM recipes WHERE title = 'Arroz con pollo'), (SELECT id FROM tags WHERE name = 'Colombiano'        AND category = 'recipes')),
((SELECT id FROM recipes WHERE title = 'Arroz con pollo'), (SELECT id FROM tags WHERE name = 'Alto en proteína'  AND category = 'recipes')),
((SELECT id FROM recipes WHERE title = 'Arroz con pollo'), (SELECT id FROM tags WHERE name = 'Latinoamericano'   AND category = 'recipes')),
-- Avena con frutas
((SELECT id FROM recipes WHERE title = 'Avena con frutas'), (SELECT id FROM tags WHERE name = 'Vegetariano'       AND category = 'recipes')),
((SELECT id FROM recipes WHERE title = 'Avena con frutas'), (SELECT id FROM tags WHERE name = 'Rápido'            AND category = 'recipes'));
