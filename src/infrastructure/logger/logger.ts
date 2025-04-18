import { createLogger, transports, format, Logger } from "winston";
import type { Format, TransformableInfo } from "logform";
const { combine, timestamp, errors, json, colorize, printf } = format;

const isProduction: boolean = process.env.NODE_ENV === "PRODUCTION";

const devFormat: Format = combine(
  colorize(),
  timestamp(),
  errors({ stack: true }),
  printf(
    (
      info: TransformableInfo & { timestamp?: string; stack?: string }
    ): string => {
      const { timestamp = "", level, message, stack } = info;
      return stack
        ? `${timestamp} [${level}]: ${message}\n${stack}`
        : `${timestamp} [${level}]: ${message}`;
    }
  )
);

const prodFormat = combine(timestamp(), errors({ stack: true }), json());

const logger = createLogger({
  level: isProduction ? "info" : "debug",
  format: isProduction ? prodFormat : devFormat,
  defaultMeta: { service: "fitness-hub-backend" } as { service: string },
  transports: [
    new transports.Console(),
  ] as transports.ConsoleTransportInstance[],
});

export default logger;
