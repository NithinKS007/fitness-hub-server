import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import {
  StatusCodes,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { GetUserSubscriptionUseCase } from "@application/usecases/subscription/get-user-subscription.usecase";
import { parseQueryParams } from "@shared/utils/parse.queryParams";

export class GetUserSubscriptionController {
  constructor(private getUserSubscriptionUseCase: GetUserSubscriptionUseCase) {}

  async handleGetUserSub(req: Request, res: Response): Promise<void> {
    const { _id: userId } = req?.user || {};

    const queryParams = parseQueryParams(req.query);

    const { userSubscriptionsList, paginationData } =
      await this.getUserSubscriptionUseCase.execute(userId, queryParams);

    sendResponse(
      res,
      StatusCodes.OK,
      { userSubscriptionsList, paginationData },
      SubscriptionStatus.SubscriptionListOfUserRetrievedSuccessfully
    );
  }
}
