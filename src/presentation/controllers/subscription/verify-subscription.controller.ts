import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  StatusCodes,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { TYPES_SUBSCRIPTION_USECASES } from "@di/types-usecases";
import { IVerifySubscriptionSessionUC } from "@application/interfaces/usecases/ISubscriptionUC";

@injectable()
export class VerifySubscriptionController {
  constructor(
    @inject(TYPES_SUBSCRIPTION_USECASES.VerifySubcriptionSessionUseCase)
    private verifySubcriptionSessionUseCase: IVerifySubscriptionSessionUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { id: sessionId } = req.params;
    const subscriptionData = await this.verifySubcriptionSessionUseCase.execute(
      sessionId
    );
    sendResponse(
      res,
      StatusCodes.OK,
      { subscriptionData: subscriptionData },
      SubscriptionStatus.Created
    );
  }
}
