import { Logger, transports, createLogger, format } from "winston";
import morgan from "morgan";
import { injectable } from "inversify";
import { Handler } from "express";
import { ILoggerService } from "@di/file-imports-index";
const { combine, timestamp, errors, colorize, printf, json } = format;

const development = process.env.NODE_ENV === "DEVELOPMENT";

const devFormat = combine(
  colorize(),
  timestamp(),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `${timestamp} [${level}]: ${message}\n${stack}`
      : `${timestamp} [${level}]: ${message}`;
  })
);

const nonDevFormat = combine(timestamp(), errors({ stack: true }), json());

@injectable()
export class LoggerService implements ILoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: development ? "debug" : "info",
      format: development ? devFormat : nonDevFormat,
      defaultMeta: { service: "FT-HUB-SERVER" },
      transports: [new transports.Console()],
    });
  }

  log(message: string): void {
    this.logger.info(message);
  }

  error(message: string, error?: Error): void {
    if (error) {
      this.logger.error(message, error);
    } else {
      this.logger.error(message);
    }
  }

  warn(message: string): void {
    this.logger.warn(message);
  }

  debug(message: string): void {
    this.logger.debug(message);
  }

  verbose(message: string): void {
    this.logger.verbose(message);
  }

  streamLog(): Handler {
    return morgan(
      ":method :url :status :res[content-length] - :response-time ms",
      {
        stream: {
          write: (message: string) => {
            this.logger.info(message.trim());
          },
        },
      }
    );
  }
}
