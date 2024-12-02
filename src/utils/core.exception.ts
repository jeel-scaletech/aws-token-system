export class ServiceError extends Error {
  constructor(
    readonly errorCode: number,
    readonly message: string,
  ) {
    super(message);
  }
}
