import type { ProfileEntity } from '../../domain/entities/profile.entity';
import { ProfileDto } from '../dto/profile.dto';

export class ProfileMapper {
  static toDto(profile: ProfileEntity): ProfileDto {
    const dto = new ProfileDto();

    dto.id = profile.id;
    dto.displayName = profile.displayName;
    dto.avatarUrl = profile.avatarUrl;

    return dto;
  }
}
