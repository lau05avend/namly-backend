# Scripts SQL manuales

Los cambios de esquema en Namly se aplican **a mano** en la base de datos (Supabase SQL Editor / `psql`), no con `prisma migrate deploy`.

Flujo habitual:

1. Ejecutar el script `.sql` correspondiente en la BD.
2. Actualizar `prisma/schema.prisma` para que refleje el modelo.
3. Correr `pnpm exec prisma generate` en local.

Cada script incluye diagnóstico, cambio y verificación cuando aplica.
