import rateLimit from "express-rate-limit";
import {
  HttpStatusCodes,
  RateLimitStatusMessage,
} from "../../shared/constants/httpResponseStructure";
import { sendResponse } from "../../shared/utils/httpResponse";

const rateLimiter = rateLimit({
 windowMs: 1 * 60 * 1000,
  max: 150,
  message: RateLimitStatusMessage.TooMany,
  statusCode: HttpStatusCodes.RateLimit,
  handler: (req, res) => {
    sendResponse(
      res,
      HttpStatusCodes.RateLimit,
      null,
      RateLimitStatusMessage.TooMany
    );
  },
});

export default rateLimiter;
