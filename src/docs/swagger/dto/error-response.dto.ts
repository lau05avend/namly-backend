import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({ example: '2026-05-28T12:00:00.000Z' })
  timestamp!: string;

  @ApiProperty({ example: '/api/v1/recipes/invalid-id' })
  path!: string;

  @ApiProperty({
    oneOf: [
      { type: 'string', example: 'Validation failed' },
      { type: 'array', items: { type: 'string' } },
    ],
  })
  message!: string | string[];
}

export class ErrorResponseDetailsDto {
  @ApiProperty({ example: 'P2025' })
  code!: string;

  @ApiPropertyOptional()
  meta?: unknown;
}
