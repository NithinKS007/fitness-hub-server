export interface ILoggerService {
  info(message: string): void;
  error(message: string | Error): void;
  debug(message: string): void;
  warn(message: string): void;
  stream: {
    write: (message: string) => void;
  };
}
