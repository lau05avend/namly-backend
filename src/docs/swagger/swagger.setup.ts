import type { INestApplication } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication, configService: ConfigService): void {
  const appName = configService.get<string>('app.name') ?? 'Namly API';
  const apiPrefix = configService.get<string>('app.apiPrefix');
  const nodeEnv = configService.get<string>('app.nodeEnv');

  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription('Namly backend API documentation')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Supabase access token',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: `${appName ?? 'Namly'} Docs`,
  });

  if (nodeEnv !== 'production') {
    console.info(`Swagger running at: http://localhost:3000/${apiPrefix}/docs`);
  }
}
