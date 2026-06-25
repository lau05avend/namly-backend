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
}
