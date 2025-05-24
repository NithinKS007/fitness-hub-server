import { Request, Response, NextFunction } from "express";
import {
  HttpStatusCodes,
  ApplicationStatus,
} from "../../shared/constants/index-constants";
import { sendResponse } from "../../shared/utils/httpResponse";
import { LoggerHelper } from "../../shared/utils/handleLog";
import { LoggerService } from "../../infrastructure/logging/logger";

class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class validationError extends AppError {
  constructor(message: string) {
    super(message, HttpStatusCodes.BadRequest);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, HttpStatusCodes.NotFound);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, HttpStatusCodes.Unauthorized);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, HttpStatusCodes.InternalServerError);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, HttpStatusCodes.Forbidden);
  }
}

const logger = new LoggerService();
const loggerHelper = new LoggerHelper(logger);

export const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  loggerHelper.handleLogError(err, req.originalUrl, err.message);
  const statusCode = err.statusCode || HttpStatusCodes.InternalServerError;
  const message = err.message || ApplicationStatus.InternalServerError;
  sendResponse(res, statusCode, null, message);
};
