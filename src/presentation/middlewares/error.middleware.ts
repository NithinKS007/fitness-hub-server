import { Request, Response, NextFunction } from "express";
import {
  StatusCodes,
  ApplicationStatus,
} from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { ReqLogService } from "@di/container-resolver";

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class validationError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.BadRequest);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.NotFound);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.Unauthorized);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.InternalServerError);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.Forbidden);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.Conflict);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.InternalServerError);
  }
}

export const errorMiddleware = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : StatusCodes.InternalServerError;
  const message = isAppError ? err.message : ApplicationStatus.InternalServerError;
  ReqLogService.error(`${req.requestId} ${err.message}`, err);
  sendResponse(res, statusCode, null, message);
};
