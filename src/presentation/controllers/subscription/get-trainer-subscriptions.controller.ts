import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import {
  StatusCodes,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { GetTrainerSubscriptionsUseCase } from "@application/usecases/subscription/get-trainer-subscriptions.usecase";

export class GetTrainerSubscriptionController {
  constructor(
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
