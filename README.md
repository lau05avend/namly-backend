
# Namly Backend - README inicial

Este documento describe la estructura y configuración inicial del backend de Namly, construido con NestJS, TypeScript y Supabase.

## Estructura del Proyecto

La estructura del proyecto sigue un enfoque modular, separando cada dominio de negocio en sus propias carpetas `application`, `domain`, `infrastructure` y `presentation`.

```
src/
├── main.ts
├── app.module.ts
│
├── config/
│   ├── app.config.ts
│   ├── supabase.config.ts
│   ├── swagger.config.ts
│   └── env.validation.ts
│
├── common/
│   ├── constants/
│   ├── decorators/
│   ├── dto/
│   ├── enums/
│   ├── exceptions/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── interfaces/
│   ├── pipes/
│   ├── types/
│   └── utils/
│
├── infrastructure/
│   ├── database/
│   │   └── supabase/
│   │       ├── supabase.module.ts
│   │       ├── supabase.service.ts
│   │       ├── supabase.types.ts
│   │       └── helpers/
│   │
│   ├── events/
│   │   ├── events.module.ts
│   │   └── event.constants.ts
│   │
│   ├── storage/
│   │   ├── storage.module.ts
│   │   └── storage.service.ts
│   │
│   ├── cron/
│   │   ├── cron.module.ts
│   │   └── reminder.scheduler.ts
│   │
│   └── logger/
│
├── shared/
│   ├── base/
│   │   ├── base.repository.ts
│   │   ├── soft-delete.repository.ts
│   │   └── base.service.ts
│   │
│   └── context/
│       ├── current-user.interface.ts
│       └── request-context.interface.ts
│
├── modules/
│   │
│   ├── auth/
│   │   ├── application/
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   └── presentation/
│   ├── profiles/
│   ├── guests/
│   ├── settings/
│   ├── onboarding/
│   ├── tags/
│   ├── recipes/
│   ├── planner/
│   ├── meal-logs/
│   ├── streaks/
│   └── notifications/
│
└── docs/
    └── swagger/
```

## Configuración de Entorno

Las variables de entorno se gestionan con `@nestjs/config` y se validan mediante Joi. Consulta `.env.example` para las variables requeridas.

## Base de Datos (Supabase)

La integración con Supabase se realiza a través del SDK de Supabase y un `Repository Pattern` manual. Se espera que RLS (Row Level Security) esté configurado en la base de datos de PostgreSQL.

## Validación de DTOs

Todas las entradas HTTP se validan utilizando DTOs con `class-validator` y `class-transformer`, configurados globalmente con `ValidationPipe`.

## Eventos Asíncronos

El sistema utiliza `@nestjs/event-emitter` para el manejo de eventos desacoplados, lo que permite la implementación de funcionalidades como seguimiento de rachas, actividad de usuario y notificaciones futuras.

## Swagger

La documentación de la API se genera automáticamente con Swagger. Accede a ella en `/api` una vez que la aplicación esté en funcionamiento.

## Instalación de Dependencias

Para instalar las dependencias necesarias, ejecuta los siguientes comandos en tu terminal:

**Dependencias de tiempo de ejecución:**
```bash
pnpm add @nestjs/config @nestjs/event-emitter @supabase/supabase-js class-validator class-transformer joi @nestjs/swagger swagger-ui-express @nestjs/schedule
```

**Dependencias de desarrollo:**
```bash
pnpm add -D @types/express @types/node
```

## Uso

1.  Copia el archivo `.env.example` a `.env` y configura tus variables de entorno.
2.  Instala las dependencias como se indica arriba.
3.  Para iniciar la aplicación en modo desarrollo:
    ```bash
    pnpm start:dev
    ```

Este es un buen punto de partida para el desarrollo. ¡Buena suerte!
