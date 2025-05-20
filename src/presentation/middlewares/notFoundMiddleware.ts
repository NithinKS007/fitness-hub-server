import {
  HttpStatusCodes,
  NotFoundStatusMessage,
} from "../../shared/constants/httpResponseStructure";
import { sendResponse } from "../../shared/utils/httpResponse";
import { Request, Response } from "express";
export const notFoundMiddleware = (req: Request, res: Response): void => {
  sendResponse(
    res,
    HttpStatusCodes.NotFound,
    null,
    NotFoundStatusMessage.NotFound
  );
};
