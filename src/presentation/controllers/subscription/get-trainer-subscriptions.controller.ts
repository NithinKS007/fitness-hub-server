import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  StatusCodes,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { TYPES_SUBSCRIPTION_USECASES } from "@di/types-usecases";
import { IGetTrainerSubscriptionsUC } from "@application/interfaces/usecases/ISubscriptionUC";

@injectable()
export class GetTrainerSubscriptionController {
  constructor(
    @inject(TYPES_SUBSCRIPTION_USECASES.GetTrainerSubscriptionsUseCase)
    private getTrainerSubscriptionUseCase: IGetTrainerSubscriptionsUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const trainerId = req?.user?._id || req.params.id;

    const subscriptionsData = await this.getTrainerSubscriptionUseCase.execute(
      trainerId
    );

    sendResponse(
      res,
      StatusCodes.OK,
      subscriptionsData,
      SubscriptionStatus.ListRetrieved
    );
  }
}
