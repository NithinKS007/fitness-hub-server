import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  StatusCodes,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { EditSubscriptionUseCase } from "@application/usecases/subscription/edit-subscription.usecase";
import { TYPES_SUBSCRIPTION_USECASES } from "di/types-usecases";

@injectable()
export class EditSubPlanController {
  constructor(
    @inject(TYPES_SUBSCRIPTION_USECASES.EditSubscriptionUseCase)
    private editSubscriptionUseCase: EditSubscriptionUseCase
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
    const { subscriptionId } = req.params;
    const { _id: trainerId } = req?.user || {};

    const editSubscriptionData = await this.editSubscriptionUseCase.execute({
      trainerId: trainerId,
      subscriptionId,
      ...req.body,
    });

    sendResponse(
      res,
      StatusCodes.OK,
      editSubscriptionData,
      SubscriptionStatus.EditedSuccess
    );
  }
}
