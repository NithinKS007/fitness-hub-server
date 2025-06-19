import morgan from "morgan";
import { createWinstonLogger } from "../../config/logger.config";
const logger = createWinstonLogger();

const stream = {
  write: (message: string) => logger.info(message.trim()),
};

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  {
    stream,
  }
);

export default morganMiddleware;
