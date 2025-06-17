import { Logger } from "winston";
import { createWinstonLogger } from "../config/logger.config";
import { ILoggerService } from "@application/interfaces/logging/ILogger.service";

export class LoggerService implements ILoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createWinstonLogger();
  }
  
  info(message: string): void {
    this.logger.info(message);
  }

  error(message: string | Error): void {
    this.logger.error(
      message instanceof Error ? message.stack || message.message : message
    );
  }

  debug(message: string): void {
    this.logger.debug(message);
  }

  warn(message: string): void {
    this.logger.warn(message);
  }

  stream = {
    write: (message: string) => this.logger.info(message.trim()),
  };
}
