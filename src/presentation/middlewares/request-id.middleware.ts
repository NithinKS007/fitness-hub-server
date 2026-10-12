import { randomUUID } from "crypto";
import { RequestHandler } from "express";

/** Propagates a stable request identifier through logs and client responses. */
export const requestIdMiddleware: RequestHandler = (req, res, next) => {
  const suppliedId = req.header("x-request-id");
  const requestId = suppliedId && suppliedId.length <= 128 ? suppliedId : randomUUID();

  req.requestId = requestId;
  res.setHeader("x-request-id", requestId);
  next();
};
