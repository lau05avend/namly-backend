# Namly Backend

API backend de **Namly**, plataforma de continuidad alimentaria orientada a adultos en Colombia. Gestiona planificación de comidas, registro diario, rachas, onboarding y recomendaciones personalizadas.

## Stack

| Capa | Tecnología |
|------|------------|
| Framework | NestJS 11, TypeScript (strict) |
| Base de datos | PostgreSQL vía **Prisma ORM** |
| Auth | Supabase Auth (validación JWT) |
| Storage | Supabase Object Storage |
| Eventos | EventEmitter2 |
| Validación | class-validator / class-transformer |
| Documentación | Swagger |

Prisma es la única capa de acceso a PostgreSQL. Supabase se usa exclusivamente para autenticación y almacenamiento de archivos.

## Arquitectura

Cada módulo de dominio sigue la misma estructura:

```
modules/<dominio>/
├── application/      # servicios y casos de uso
├── domain/           # entidades, reglas e interfaces
├── infrastructure/   # repositorios (Prisma)
├── presentation/     # controllers, DTOs, mappers
└── <dominio>.module.ts
```

Principios clave:

- **Multi-tenant:** toda consulta de datos de usuario se filtra por `profileId`, obtenido del contexto de la petición.
- **Capas separadas:** los controllers no acceden a Prisma; los repositorios no contienen lógica de negocio.
- **Mensajes de dominio en backend:** textos analíticos, resúmenes e insights se generan en el servidor, no en el cliente.

Infraestructura transversal en `src/infrastructure/` (Prisma, Supabase, storage, cron, eventos) y utilidades compartidas en `src/common/`.

## Módulos

| Módulo | Responsabilidad |
|--------|-----------------|
| `auth` | Sincronización de sesión (`POST /auth/me`) |
| `profiles` | Perfil del usuario |
| `onboarding` | Preguntas y respuestas de onboarding |
| `tags` | Etiquetas por categoría |
| `measurement-units` | Unidades de medida |
| `meal-types` | Tipos de comida |
| `recipes` | Recetas, carpetas e interacciones |
| `planner` | Comidas planificadas (`scheduled-meals`) |
| `meal-logs` | Registro de comidas |
| `streaks` | Rachas y actividad diaria |
| `notifications` | Notificaciones y recordatorios |
| `platform-settings` | Preferencias de plataforma |
| `home` | Agregado de pantalla principal |
| `analytics` | Insights de ritmo y hábitos |
| `guests` | Sesiones de invitado (interno) |

Prefijo global de la API: `/api/v1`.

## Autenticación

Las rutas protegidas requieren un token Bearer de Supabase:

```
Authorization: Bearer <access_token>
```

El guard global valida el JWT, resuelve el perfil interno y expone `profileId` al resto de la aplicación. Las rutas marcadas con `@Public()` (por ejemplo, `GET /onboarding/questions`) no requieren token.

## Requisitos previos

- Node.js 20+
- pnpm
- Proyecto Supabase con PostgreSQL
- Variables de entorno configuradas (ver `.env.example`)

## Configuración

1. Copiar el archivo de entorno:

```bash
cp .env.example .env
```

2. Completar las variables en `.env`. Referencia por sección:

**Aplicación**

| Variable | Descripción | Default |
|----------|-------------|---------|
| `APP_NAME` | Nombre mostrado en Swagger | `Namly API` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `PORT` | Puerto del servidor | `3000` |

**API**

| Variable | Descripción | Default |
|----------|-------------|---------|
| `API_PREFIX` | Prefijo global de rutas | `api/v1` |
| `CORS_ORIGIN` | Origen permitido para CORS | `*` |

**Base de datos (Supabase / PostgreSQL)**

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Conexión Prisma en runtime (pooler, puerto 6543). No usar con `$transaction`. |
| `DIRECT_URL` | Conexión directa (puerto 5432). Usar para migraciones y transacciones Prisma. |

**Supabase**

| Variable | Descripción |
|----------|-------------|
| `SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_ANON_KEY` | Clave anónima |
| `SUPABASE_JWT_SECRET` | Secreto JWT del proyecto (validación de tokens) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio |

La validación de arranque exige todas las variables anteriores excepto `SUPABASE_JWT_SECRET`, que se lee desde la configuración de Supabase. Valores de ejemplo en `.env.example`.

3. Instalar dependencias:

```bash
pnpm install
```

4. Generar el cliente Prisma:

```bash
pnpm exec prisma generate
```

5. Aplicar migraciones (si corresponde):

```bash
pnpm exec prisma migrate dev
```

## Scripts

```bash
pnpm start:dev      # desarrollo con hot-reload
pnpm start:prod     # producción (requiere build previo)
pnpm build          # compilar
pnpm lint           # ESLint
pnpm test           # tests unitarios
pnpm test:e2e       # tests e2e
```

## Swagger

Con la aplicación en marcha, la documentación interactiva está en:

```
http://localhost:3000/api/v1/docs
```

- Autenticación: botón **Authorize** con el access token de Supabase (`Bearer <token>`).
- Rutas públicas (sin candado): `GET /onboarding/questions`, `GET /tags/system`, `GET /meal-types/system`.
- Los schemas de request/response se generan desde los DTOs con el plugin de `@nestjs/swagger`.
- Decoradores compartidos en `src/docs/swagger/` para respuestas de error estándar.
- Ejemplos reales en `src/docs/swagger/swagger.examples.ts`. Regenerar datos base con `pnpm exec ts-node scripts/fetch-swagger-samples.ts`.

## Estructura del repositorio

```
namly-backend/
├── prisma/              # schema y migraciones
├── src/
│   ├── common/          # guards, filters, decorators, DTOs base
│   ├── config/          # configuración y validación de entorno
│   ├── docs/swagger/    # setup de Swagger
│   ├── generated/prisma/# cliente Prisma generado
│   ├── infrastructure/  # Prisma, Supabase, storage, cron
│   ├── modules/         # módulos de dominio
│   ├── shared/          # contexto de petición e interfaces base
│   ├── app.module.ts
│   └── main.ts
└── test/
```

## Notas de desarrollo

- Los DTOs de entrada usan `@Trim()` en campos string; el `ValidationPipe` global ya tiene `transform: true`.
- El cliente Prisma se genera en `src/generated/prisma`; no editar manualmente.
- Para transacciones Prisma y migraciones usar `DIRECT_URL` (puerto 5432). `DATABASE_URL` apunta al pooler (puerto 6543) y no es compatible con `$transaction`.
- Las reglas de arquitectura detalladas están en `.cursor/rules/`.
