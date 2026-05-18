import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '@common/constants/auth-metadata.constants';

export const Public = (): ReturnType<typeof SetMetadata> => SetMetadata(IS_PUBLIC_KEY, true);
