import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  StatusCodes,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { GetUserSubscriptionUseCase } from "@application/usecases/subscription/get-user-subscription.usecase";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { TYPES_SUBSCRIPTION_USECASES } from "di/types-usecases";

@injectable()
export class GetUserSubscriptionController {
  constructor(
    @inject(TYPES_SUBSCRIPTION_USECASES.GetUserSubscriptionUseCase)
    private getUserSubscriptionUseCase: GetUserSubscriptionUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { _id: userId } = req?.user || {};

    const queryParams = parseQueryParams(req.query);

    const { userSubscriptionsList, paginationData } =
      await this.getUserSubscriptionUseCase.execute(userId, queryParams);

    sendResponse(
      res,
      StatusCodes.OK,
      { userSubscriptionsList, paginationData },
      SubscriptionStatus.UserSubscriptionsRetrieved
    );
  }
}
