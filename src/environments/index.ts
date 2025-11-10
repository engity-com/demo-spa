// @ts-expect-error
import { environment as source } from '@environment';
import type { Environment } from './type';

export * from './type';

export const environment: Environment = source;
