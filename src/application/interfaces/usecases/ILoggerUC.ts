import { LogLevel } from "@application/dtos/logger-dtos";

export interface ILoggerUC {
  LogError(error: unknown, context?: string, message?: string): void;
  LogInfo(level: LogLevel, message: string, metadata?: object): void;
}
