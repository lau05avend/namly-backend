import { Injectable } from '@nestjs/common';
import type { UserOnboardingResponseEntity } from '../domain/entities/user-onboarding-response.entity';
import { collapseRowsToResponses } from '../domain/utils/collapse-onboarding-response-rows.util';
import { UserOnboardingResponseRepository } from '../infrastructure/repositories/user-onboarding-response.repository';

@Injectable()
export class OnboardingResponsesService {
  constructor(
    private readonly userOnboardingResponseRepository: UserOnboardingResponseRepository,
  ) {}

  async getResponses(profileId: string): Promise<UserOnboardingResponseEntity[]> {
    const rows = await this.userOnboardingResponseRepository.findAllRowsByProfileId(profileId);

    return collapseRowsToResponses(rows);
  }
}
