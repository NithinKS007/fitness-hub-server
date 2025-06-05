import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  HttpStatusCodes,
  SubscriptionStatus,
} from "../../../shared/constants/index.constants";
import { GetTrainerSubscriptionsUseCase } from "../../../application/usecases/subscription/get-trainer-subscriptions.usecase";
import { parseQueryParams } from "../../../shared/utils/parse.queryParams";
import { GetTrainerSubscribersUseCase } from "../../../application/usecases/subscription/get-trainer-subscribed-users.usecase";

export class TrainerSubscriptionController {
  constructor(
    private getTrainerSubscriptionUseCase: GetTrainerSubscriptionsUseCase,
    private getTrainerSubscribersUseCase :GetTrainerSubscribersUseCase
  ) {}

  async getTrainerSubscriptions(req: Request, res: Response): Promise<void> {
    const trainerId = req?.user?._id || req.params.trainerId;
    const subscriptionsData =
      await this.getTrainerSubscriptionUseCase.execute(
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
      await this.getTrainerSubscribersUseCase.execute(
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
