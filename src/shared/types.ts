// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TODO = any;

export type TError = {
  errors: { field?: string; message: string[] | string }[] | null;
  message: string;
} | null;

export type DataHookReturn<TData> = [
  TData,
  { error: TError; isLoading: boolean },
];

export type ActionHookReturn = [
  (...p: any[]) => Promise<{ data: unknown; error: TError; success: boolean }>,
  { error: TError; isLoading: boolean },
];

type Fn = (...args: any[]) => void;

export type Methods<T> = {
  [Key in keyof T]: T[Key] extends Fn ? T[Key] : never;
};

export type MethodsReturn<T> = {
  [Key in keyof T]: T[Key] extends Fn ? ReturnType<T[Key]> : never;
};
