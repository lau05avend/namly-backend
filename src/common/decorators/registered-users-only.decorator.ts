import { SetMetadata } from '@nestjs/common';
import { REGISTERED_USERS_ONLY_KEY } from '@common/constants/guest-metadata.constants';

export const RegisteredUsersOnly = () => SetMetadata(REGISTERED_USERS_ONLY_KEY, true);
