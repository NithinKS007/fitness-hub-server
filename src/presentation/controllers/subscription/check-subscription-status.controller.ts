import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import {
  StatusCodes,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { CheckSubscriptionStatusUseCase } from "@application/usecases/subscription/check-subscription-status.usecase";

export class CheckSubscriptionStatusController {
  constructor(
    private checkSubscriptionStatusUseCase: CheckSubscriptionStatusUseCase
  ) {}

  async handleCheckSubStatus(req: Request, res: Response): Promise<void> {
    const { _id: userId } = req?.user || {};
    const { trainerId } = req.params;

    const isUserSubscribedToTheTrainer =
      await this.checkSubscriptionStatusUseCase.execute({
        userId,
        trainerId,
      });

    sendResponse(
      res,
      StatusCodes.OK,
      { isUserSubscribedToTheTrainer },
      SubscriptionStatus.UserIsSubscribed
    );
  }
}
