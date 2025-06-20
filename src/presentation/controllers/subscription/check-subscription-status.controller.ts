import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  StatusCodes,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { CheckSubscriptionStatusUseCase } from "@application/usecases/subscription/check-subscription-status.usecase";
import { TYPES_SUBSCRIPTION_USECASES } from "di/types-usecases";

@injectable()
export class CheckSubscriptionStatusController {
  constructor(
    @inject(TYPES_SUBSCRIPTION_USECASES.CheckSubscriptionStatusUseCase)
    private checkSubscriptionStatusUseCase: CheckSubscriptionStatusUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
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
