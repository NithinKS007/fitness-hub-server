import logger from "../../infrastructure/logger/logger";
type LogLevel = "info" | "error" | "debug" | "warn";

export const handleLogError = (
  error: unknown,
  context: string = "Error",
  customMessage?: string
) => {
  const message = customMessage || "An error occurred";

  if (error instanceof Error) {
    logger.error(`[${context}] ${message}: ${error.message}`, {
      stack: error.stack,
    });
  } else {
    logger.error(`[${context}] ${message}: Unknown error`, { error });
  }
};

export const handleLogInfo = (
  level: LogLevel,
  message: string,
  metadata = {}
) => {
  logger[level]({
    message,
    ...metadata,
    timestamp: new Date().toISOString(),
  });
};
