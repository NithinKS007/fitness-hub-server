import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  StatusCodes,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { GetTrainerSubscribersUseCase } from "@application/usecases/subscription/get-trainer-subscribed-users.usecase";
import { TYPES_SUBSCRIPTION_USECASES } from "di/types-usecases";

@injectable()
export class GetTrainerSubscribersController {
  constructor(
    @inject(TYPES_SUBSCRIPTION_USECASES.GetTrainerSubscribersUseCase)
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
