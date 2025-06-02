import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { Express } from "express";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload | undefined;
    }
  }
}
