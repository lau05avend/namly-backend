import type { PlatformSettingsEntity } from '../../domain/entities/platform-settings.entity';
import { PlatformSettingsDto } from '../dto/platform-settings.dto';

export class PlatformSettingsMapper {
  static toDto(entity: PlatformSettingsEntity): PlatformSettingsDto {
    const dto = new PlatformSettingsDto();

    dto.weightUnitId = entity.weightUnitId;
    dto.volumeUnitId = entity.volumeUnitId;
    dto.language = entity.language;
    dto.theme = entity.theme;

    return dto;
  }
}
