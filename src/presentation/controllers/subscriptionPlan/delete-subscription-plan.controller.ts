import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  StatusCodes,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { DeleteSubscriptionUseCase } from "@application/usecases/subscription/delete-subscription.usecase";
import { TYPES_SUBSCRIPTION_USECASES } from "di/types-usecases";

@injectable()
export class DeleteSubPlanController {
  constructor(
    @inject(TYPES_SUBSCRIPTION_USECASES.DeleteSubscriptionUseCase)
    private deleteSubscriptionUseCase: DeleteSubscriptionUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { subscriptionId } = req.params;

    const deletedSubscriptionData =
      await this.deleteSubscriptionUseCase.execute(subscriptionId);

    sendResponse(
      res,
      StatusCodes.OK,
      deletedSubscriptionData,
      SubscriptionStatus.DeletedSuccess
    );
  }
}
