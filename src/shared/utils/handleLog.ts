import { ILoggerService } from "../../application/interfaces/logging/ILogger";

type LogLevel = "info" | "error" | "debug" | "warn";

export class LoggerHelper {
  private logger: ILoggerService;

  constructor(logger: ILoggerService) {
    this.logger = logger;
  }

  handleLogError(
    error: unknown,
    context: string = "Error",
    customMessage?: string
  ): void {
    const message = customMessage || "An error occurred";

    if (error instanceof Error) {
      this.logger.error(
        `[${context}] ${message}: ${error.message}\n${error.stack}`
      );
    } else {
      this.logger.error(`[${context}] ${message}: Unknown error`);
    }
  }

  handleLogInfo(level: LogLevel, message: string, metadata: object = {}): void {
    this.logger[level](`${message} ${JSON.stringify(metadata)}`);
  }
}
