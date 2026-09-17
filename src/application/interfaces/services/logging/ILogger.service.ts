import { Handler } from "express";

export interface ILoggerService {
  log(message: string): void;
  error(message: string, error?: Error): void;
  warn(message: string): void;
  debug(message: string): void;
  verbose(message: string): void;
  streamLog(): Handler;
}
