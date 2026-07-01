import type { AuthMeResultEntity } from '../../domain/entities/auth-me-result.entity';
import { AuthMeResponseDto } from '../dto/auth-me-response.dto';

export class AuthMeMapper {
  static toDto(entity: AuthMeResultEntity): AuthMeResponseDto {
    const dto = new AuthMeResponseDto();
    dto.id = entity.id;
    dto.displayName = entity.displayName;
    dto.avatarUrl = entity.avatarUrl;
    dto.email = entity.email;
    dto.hasCompletedOnboarding = entity.hasCompletedOnboarding;
    dto.isNewUser = entity.isNewUser;
    dto.isGuest = entity.isGuest;
    dto.guestExpiresAt = entity.guestExpiresAt;
    return dto;
  }
}
