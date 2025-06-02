import {
  HttpStatusCodes,
  ApplicationStatus,
} from "../../shared/constants/index.constants";
import { sendResponse } from "../../shared/utils/http.response";
import { NextFunction, Request, Response } from "express";
export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  sendResponse(
    res,
    HttpStatusCodes.NotFound,
    null,
    ApplicationStatus.ResourceNotFound
  );
};
