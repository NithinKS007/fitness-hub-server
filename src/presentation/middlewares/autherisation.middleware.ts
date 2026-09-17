import { ApplicationStatus } from "@shared/constants/index.constants";
import { NextFunction, Request, Response } from "express";
import { ForbiddenError } from "./error.middleware";

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!allowedRoles.includes(req?.user?.role)) {
      next(new ForbiddenError(ApplicationStatus.AccessDenied));
      return;
    }
    next();
  };
};
