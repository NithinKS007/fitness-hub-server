import { inject, injectable } from "inversify";
import { ILoggerService } from "../interfaces/logging/ILogger.service";
import { LogLevel } from "@application/dtos/logger-dtos";
import { TYPES_SERVICES } from "@di/types-services";

@injectable()
export class LoggerUseCase {
  constructor(
    @inject(TYPES_SERVICES.LoggerService)
    private logger: ILoggerService
  ) {}

  LogError(error: unknown, context: string = "Error", message?: string): void {
    const errorMessage = message || "An error occurred";

    if (error instanceof Error) {
      this.logger.error(
        `[${context}] ${errorMessage}: ${error.message}\n${error.stack}`
      );
    } else {
      this.logger.error(`[${context}] ${errorMessage}: Unknown error`);
    }
  }

  LogInfo(level: LogLevel, message: string, metadata: object = {}): void {
    this.logger[level](`${message} ${JSON.stringify(metadata)}`);
  }
}
