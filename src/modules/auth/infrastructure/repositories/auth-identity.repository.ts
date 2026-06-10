import { Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

const profileSelect = {
  id: true,
  displayName: true,
  avatarUrl: true,
} as const;

export type AuthIdentityWithProfileRecord = {
  id: string;
  profileId: string;
  email: string | null;
  profile: {
    id: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
};

export type CreateAuthIdentityParams = {
  profileId: string;
  authUserId: string;
  provider: string;
  externalId: string;
  email: string | null;
  lastSignIn: Date;
};

@Injectable()
export class AuthIdentityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByAuthUserId(authUserId: string): Promise<AuthIdentityWithProfileRecord | null> {
    const record = await this.prisma.authIdentity.findUnique({
      where: { authUserId },
      select: {
        id: true,
        profileId: true,
        email: true,
        profile: { select: profileSelect },
      },
    });

    return record;
  }

  async createRecord(
    tx: Prisma.TransactionClient,
    params: CreateAuthIdentityParams,
  ): Promise<AuthIdentityWithProfileRecord> {
    const record = await tx.authIdentity.create({
      data: {
        profileId: params.profileId,
        authUserId: params.authUserId,
        provider: params.provider,
        externalId: params.externalId,
        email: params.email,
        lastSignIn: params.lastSignIn,
      },
      select: {
        id: true,
        profileId: true,
        email: true,
        profile: { select: profileSelect },
      },
    });

    return record;
  }

  async updateEmailAndLastSignIn(
    authIdentityId: string,
    params: { email: string | null; lastSignIn: Date },
    tx?: Prisma.TransactionClient,
  ): Promise<AuthIdentityWithProfileRecord> {
    const client = tx ?? this.prisma;

    return client.authIdentity.update({
      where: { id: authIdentityId },
      data: {
        email: params.email,
        lastSignIn: params.lastSignIn,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        profileId: true,
        email: true,
        profile: { select: profileSelect },
      },
    });
  }
}
