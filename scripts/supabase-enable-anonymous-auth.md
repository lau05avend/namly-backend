# Habilitar Supabase Anonymous Auth (manual)

1. Abre el proyecto en [Supabase Dashboard](https://supabase.com/dashboard).
2. Ve a **Authentication → Providers**.
3. En **Anonymous sign-ins**, activa el toggle.
4. Guarda los cambios.
5. Confirma que **Google** sigue habilitado (necesario para `linkIdentity` al convertir invitado).

No requiere cambios en la base de datos: la tabla `guest_sessions` ya existe en el schema de Prisma.
