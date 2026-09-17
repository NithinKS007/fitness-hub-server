import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  StatusCodes,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { TYPES_SUBSCRIPTION_USECASES } from "@di/types-usecases";
import { ISubscriptionBlockUC } from "@application/interfaces/usecases/ISubscriptionPlanUC";

@injectable()
export class BlockSubPlanController {
  constructor(
    @inject(TYPES_SUBSCRIPTION_USECASES.SubscriptionBlockUseCase)
    private subscriptionBlockUseCase: ISubscriptionBlockUC
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
    const { id: subscriptionId } = req.params;
    const { isBlocked } = req.body;

    const updatedSubData = {
      subscriptionId,
      isBlocked,
    };

    const updatedSubscriptionStatus =
      await this.subscriptionBlockUseCase.execute(updatedSubData);

    sendResponse(
      res,
      StatusCodes.OK,
      updatedSubscriptionStatus,
      SubscriptionStatus.StatusUpdated
    );
  }
}
