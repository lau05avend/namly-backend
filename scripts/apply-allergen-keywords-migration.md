# Migración: alérgenos + keywords

Ejecutar en la base de datos (Supabase SQL Editor o `psql` con `DIRECT_URL`):

```
supabase/migrations/20260601120000_allergen_tags_and_keywords.sql
```

Luego:

```bash
npx prisma generate
```

La migración crea `tag_keywords`, inserta tags `allergens` del sistema, keywords de match en ingredientes y vincula las opciones de onboarding (pregunta 2) vía `linked_tag_id`.
