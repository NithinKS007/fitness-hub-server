import { createLogger, transports, format, Logger } from "winston";

const { combine, timestamp, errors, json, colorize, printf } = format;

const isProduction = process.env.NODE_ENV === "PRODUCTION";

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

const prodFormat = combine(timestamp(), errors({ stack: true }), json());

export const createWinstonLogger = (): Logger => {
  const logger = createLogger({
    level: isProduction ? "info" : "debug",
    format: isProduction ? prodFormat : devFormat,
    defaultMeta: { service: "fitness-hub-backend" },
    transports: [new transports.Console()],
  });
  return logger as Logger;
};
