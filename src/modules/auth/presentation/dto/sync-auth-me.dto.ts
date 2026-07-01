import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Trim } from '@common/decorators/trim.decorator';
import { SwaggerExamples } from '@/docs/swagger/swagger.examples';

export class SyncAuthMeDto {
  @ApiPropertyOptional({
    description: 'Nombre visible del usuario',
    example: SwaggerExamples.text.displayName,
  })
  @IsOptional()
  @IsString()
  @Trim()
  displayName?: string;

  @ApiPropertyOptional({
    description: 'Identificador estable del dispositivo para guest_sessions',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsOptional()
  @IsString()
  @Trim()
  deviceId?: string;
}
