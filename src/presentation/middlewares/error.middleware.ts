import { Request, Response, NextFunction } from "express";
import {
  StatusCodes,
  ApplicationStatus,
} from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { loggerUseCase } from "@di/container-resolver";

class AppError extends Error {
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

export const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  loggerUseCase.LogError(err, req.originalUrl, err.message);
  const statusCode = err.statusCode || StatusCodes.InternalServerError;
  const message = err.message || ApplicationStatus.InternalServerError;
  sendResponse(res, statusCode, null, message);
};
