import { ValidationError } from '../classes';
import type { TError } from '../types';

const formatError = (error: Error | string): TError => {
  let formattedError: TError = null;

  if (error instanceof ValidationError) {
    formattedError = {
      errors: [{ field: error.meta.field, message: error.meta.message }],
      message: error.message,
    };
  } else if (error instanceof Error) {
    formattedError = { errors: null, message: error.message };
  } else {
    formattedError = { errors: null, message: error };
  }

  return formattedError;
};

export default formatError;
