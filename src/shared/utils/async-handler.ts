import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";

export const asyncHandler = (
  controllerMethod: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>
) => expressAsyncHandler(controllerMethod);
