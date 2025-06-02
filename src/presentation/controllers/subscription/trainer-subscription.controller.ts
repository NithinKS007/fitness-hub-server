import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  HttpStatusCodes,
  SubscriptionStatus,
} from "../../../shared/constants/index.constants";
import { GetTrainerSubscriptionUseCase } from "../../../application/usecases/subscription/get-trainer-subscription.usecase";
import { parseQueryParams } from "../../../shared/utils/parse.queryParams";

export class TrainerSubscriptionController {
  constructor(
    private getTrainerSubscriptionUseCase: GetTrainerSubscriptionUseCase
  ) {}

  async getTrainerSubscriptions(req: Request, res: Response): Promise<void> {
    const trainerId = req?.user?._id || req.params.trainerId;
    const subscriptionsData =
      await this.getTrainerSubscriptionUseCase.getTrainerSubscriptions(
        trainerId
      );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      subscriptionsData,
      SubscriptionStatus.SubscriptionsListRetrieved
    );
  }

  async getTrainerSubscribedUsers(req: Request, res: Response): Promise<void> {
    const trainerId = req?.user?._id;
    const queryParams = parseQueryParams(req.query);
    const { trainerSubscribers, paginationData } =
      await this.getTrainerSubscriptionUseCase.getTrainerSubscribedUsers(
        trainerId,
        queryParams
      );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { trainerSubscribers, paginationData },
      SubscriptionStatus.SubscriptionsListRetrieved
    );
  }
}
