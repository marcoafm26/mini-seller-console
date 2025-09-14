import type { ApiError } from './error';

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
      error?: never;
    }
  | {
      success: false;
      data?: never;
      error: ApiError;
    };
