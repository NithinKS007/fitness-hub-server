import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  StatusCodes,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { TYPES_SUBSCRIPTION_USECASES } from "@di/types-usecases";
import { ICheckSubscriptionStatusUC } from "@application/interfaces/usecases/ISubscriptionUC";

@injectable()
export class CheckSubscriptionStatusController {
  constructor(
    @inject(TYPES_SUBSCRIPTION_USECASES.CheckSubscriptionStatusUseCase)
    private checkSubscriptionStatusUseCase: ICheckSubscriptionStatusUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { _id: userId } = req?.user || {};
    const { id: trainerId } = req.params;

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
