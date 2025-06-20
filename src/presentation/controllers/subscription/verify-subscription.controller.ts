import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  StatusCodes,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { VerifySubcriptionSessionUseCase } from "@application/usecases/subscription/verify-subscription-session.usecase";
import { TYPES_SUBSCRIPTION_USECASES } from "di/types-usecases";

@injectable()
export class VerifySubscriptionController {
  constructor(
    @inject(TYPES_SUBSCRIPTION_USECASES.VerifySubcriptionSessionUseCase)
    private verifySubcriptionSessionUseCase: VerifySubcriptionSessionUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
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
