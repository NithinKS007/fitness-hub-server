import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  StatusCodes,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { GetTrainerSubscriptionsUseCase } from "@application/usecases/subscription/get-trainer-subscriptions.usecase";
import { TYPES_SUBSCRIPTION_USECASES } from "di/types-usecases";

@injectable()
export class GetTrainerSubscriptionController {
  constructor(
    @inject(TYPES_SUBSCRIPTION_USECASES.GetTrainerSubscriptionsUseCase)
    private getTrainerSubscriptionUseCase: GetTrainerSubscriptionsUseCase
  ) {}

  async handleGetTrainerSubscriptions(
    req: Request,
    res: Response
  ): Promise<void> {
    const trainerId = req?.user?._id || req.params.trainerId;

    const subscriptionsData = await this.getTrainerSubscriptionUseCase.execute(
      trainerId
    );

    sendResponse(
      res,
      StatusCodes.OK,
      subscriptionsData,
      SubscriptionStatus.SubscriptionsListRetrieved
    );
  }
}
