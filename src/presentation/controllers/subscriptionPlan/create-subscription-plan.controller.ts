import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  StatusCodes,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { TYPES_SUBSCRIPTION_USECASES } from "@di/types-usecases";
import { ICreateSubscriptionUC } from "@application/interfaces/usecases/ISubscriptionPlanUC";

@injectable()
export class CreateSubPlanController {
  constructor(
    @inject(TYPES_SUBSCRIPTION_USECASES.CreateSubscriptionUseCase)
    private createSubscriptionUseCase: ICreateSubscriptionUC
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
    const { _id: trainerId } = req?.user || {};

    const subscriptionData = await this.createSubscriptionUseCase.execute({
      trainerId,
      ...req.body,
    });

    sendResponse(
      res,
      StatusCodes.Created,
      subscriptionData,
      SubscriptionStatus.Created
    );
  }
}
