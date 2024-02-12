export class ValidationError extends Error {
  constructor(
    message: string,
    public meta: { field: string; message: string | string[] },
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
