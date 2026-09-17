import { StatusCodes } from "@shared/constants/http.status.codes";
import { ApplicationStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator/lib";

export const validate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendResponse(
      res,
      StatusCodes.BadRequest,
      { errors: errors.array() },
      ApplicationStatus.AllFieldsAreRequired
    );
    return
  }
  next();
};
