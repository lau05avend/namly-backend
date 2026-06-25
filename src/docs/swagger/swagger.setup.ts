import type { INestApplication } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_BEARER_AUTH } from './swagger.constants';

export function setupSwagger(app: INestApplication, configService: ConfigService): void {
  const appName = configService.get<string>('app.name') ?? 'Namly API';
  const apiPrefix = configService.get<string>('app.apiPrefix');
  const port = configService.get<number>('app.port') ?? 3000;
  const environment = configService.get<string>('app.environment');

  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(
      [
        'API REST de Namly. Plataforma de continuidad alimentaria.',
        '',
        'Autenticación: enviar el access token de Supabase en el header `Authorization: Bearer <token>`.',
        'Las rutas públicas no requieren token (catálogos de sistema y preguntas de onboarding).',
      ].join('\n'),
    )
    .setVersion('1.0.0')
    .addServer(`http://localhost:${port}`, 'Local')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Access token de Supabase Auth',
      },
      SWAGGER_BEARER_AUTH,
    )
    .addTag('Auth', 'Sincronización de sesión y perfil interno')
    .addTag('Profile', 'Perfil del usuario')
    .addTag('Onboarding', 'Preguntas y respuestas de onboarding')
    .addTag('Home', 'Agregado de la pantalla principal')
    .addTag('Analytics', 'Insights de ritmo y hábitos')
    .addTag('Scheduled Meals', 'Planificador de comidas')
    .addTag('Meal Logs', 'Registro de comidas')
    .addTag('Recipes', 'Recetas del usuario')
    .addTag('Recipe Folders', 'Carpetas de recetas')
    .addTag('Recipe Interactions', 'Interacciones con recetas')
    .addTag('Tags', 'Etiquetas por categoría')
    .addTag('Meal Types', 'Tipos de comida')
    .addTag('Measurement Units', 'Unidades de medida')
    .addTag('Platform Settings', 'Preferencias de plataforma')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: `${appName} — Documentación`,
  });

  if (environment !== 'production') {
    console.info(`Swagger: http://localhost:${port}/${apiPrefix}/docs`);
  }
}
