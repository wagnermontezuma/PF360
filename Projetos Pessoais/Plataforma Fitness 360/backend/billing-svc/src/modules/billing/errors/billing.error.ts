export class BillingError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'BillingError';

    // Preserva o stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BillingError);
    }

    // Mantém o stack trace original se houver erro original
    if (cause?.stack) {
      this.stack = `${this.stack}\nCaused by: ${cause.stack}`;
    }
  }
} 