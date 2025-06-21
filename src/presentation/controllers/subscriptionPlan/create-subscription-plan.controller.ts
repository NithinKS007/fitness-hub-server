import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  StatusCodes,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { CreateSubscriptionUseCase } from "@application/usecases/subscription/create-subscription.usecase";
import { TYPES_SUBSCRIPTION_USECASES } from "@di/types-usecases";

@injectable()
export class CreateSubPlanController {
  constructor(
    @inject(TYPES_SUBSCRIPTION_USECASES.CreateSubscriptionUseCase)
    private createSubscriptionUseCase: CreateSubscriptionUseCase
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
    const { _id: trainerId } = req?.user || {};

    const subscriptionData = await this.createSubscriptionUseCase.execute({
      trainerId,
      ...req.body,
    });

    sendResponse(
      res,
      StatusCodes.OK,
      subscriptionData,
      SubscriptionStatus.Created
    );
  }
}
