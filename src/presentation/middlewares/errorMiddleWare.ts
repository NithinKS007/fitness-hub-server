import { Request, Response, NextFunction } from "express";
import {
  HttpStatusCodes,
  HttpStatusMessages,
} from "../../shared/constants/httpResponseStructure";
import { sendResponse } from "../../shared/utils/httpResponse";

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


export const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || HttpStatusCodes.InternalServerError;
  const message = err.message || HttpStatusMessages.InternalServerError;

  sendResponse(res, statusCode, null, message);
};

export const createAppError = (message: string, statusCode: number) => {

  return new AppError(message, statusCode);
};

