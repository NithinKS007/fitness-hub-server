import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  StatusCodes,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { TYPES_SUBSCRIPTION_USECASES } from "@di/types-usecases";
import { IGetUserSubscriptionsUC } from "@application/interfaces/usecases/ISubscriptionUC";

@injectable()
export class GetUserSubscriptionController {
  constructor(
    @inject(TYPES_SUBSCRIPTION_USECASES.GetUserSubscriptionUseCase)
    private getUserSubscriptionUseCase: IGetUserSubscriptionsUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { _id: userId } = req?.user || {};

    const queryParams = parseQueryParams(req.query);

    const { userSubscriptionsList, paginationData } =
      await this.getUserSubscriptionUseCase.execute({ userId, ...queryParams });

    sendResponse(
      res,
      StatusCodes.OK,
      { userSubscriptionsList, paginationData },
      SubscriptionStatus.UserSubscriptionsRetrieved
    );
  }
}
