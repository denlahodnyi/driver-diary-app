import type { TError } from '../types';

type BuildActionHookResultParam<TData = null> =
  | { error?: TError; data: TData }
  | { data?: TData; error: TError };

const buildActionHookResult = <TData = null>({
  data,
  error,
}: BuildActionHookResultParam<TData>) => {
  const isSuccess = !error;

  if (isSuccess) {
    return { data: data ?? null, error: null, success: isSuccess };
  }
  return { data: null, error, success: isSuccess };
};

export default buildActionHookResult;
