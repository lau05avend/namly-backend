import { Global, Injectable, Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createResilientPrismaClient } from './create-resilient-prisma-client';
import { PrismaService } from './prisma.service';

@Injectable()
class PrismaShutdown implements OnModuleDestroy {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleDestroy(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PrismaService,
      useFactory: async (configService: ConfigService): Promise<PrismaService> => {
        const databaseUrl =
          configService.get<string>('app.directDatabaseUrl') ??
          configService.get<string>('app.databaseUrl');

        if (!databaseUrl) {
          throw new Error('DIRECT_URL or DATABASE_URL must be configured');
        }

        const client = createResilientPrismaClient(databaseUrl);
        await client.$connect();

        return client as unknown as PrismaService;
      },
      inject: [ConfigService],
    },
    PrismaShutdown,
  ],
  exports: [PrismaService],
})
export class PrismaModule {}
