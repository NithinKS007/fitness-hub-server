import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import {
  StatusCodes,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { VerifySubcriptionSessionUseCase } from "@application/usecases/subscription/verify-subscription-session.usecase";

export class VerifySubscriptionController {
  constructor(
    private verifySubcriptionSessionUseCase: VerifySubcriptionSessionUseCase
  ) {}

  async handleVerifySubscription(req: Request, res: Response): Promise<void> {
    const { sessionId } = req.params;
    const subscriptionData = await this.verifySubcriptionSessionUseCase.execute(
      sessionId
    );
    sendResponse(
      res,
      StatusCodes.OK,
      { subscriptionData: subscriptionData },
      SubscriptionStatus.SubscriptionAddedSuccess
    );
  }
}
