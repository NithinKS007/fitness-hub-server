import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import {
  StatusCodes,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { parseQueryParams } from "@shared/utils/parse.queryParams";
import { GetTrainerSubscribersUseCase } from "@application/usecases/subscription/get-trainer-subscribed-users.usecase";

export class GetTrainerSubscribersController {
  constructor(
    private getTrainerSubscribersUseCase: GetTrainerSubscribersUseCase
  ) {}

  async handleGetTrainerSubscribedUsers(
    req: Request,
    res: Response
  ): Promise<void> {
    const { _id: trainerId } = req?.user || {};

    const queryParams = parseQueryParams(req.query);

    const { trainerSubscribers, paginationData } =
      await this.getTrainerSubscribersUseCase.execute(trainerId, queryParams);

    sendResponse(
      res,
      StatusCodes.OK,
      { trainerSubscribers, paginationData },
      SubscriptionStatus.SubscriptionsListRetrieved
    );
  }
}
